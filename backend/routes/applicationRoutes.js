const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');

// POST: Student applies to a job
router.post('/apply', async (req, res) => {
  try {
    const { jobId, studentId } = req.body;

    // Fetch the entities to calculate match score securely on the backend
    const job = await Job.findById(jobId);
    const student = await User.findById(studentId);

    if (!job || !student) {
      return res.status(404).json({ message: 'Job or Student not found.' });
    }

    // Check if already applied to prevent duplicates
    const existingApp = await Application.findOne({ jobId, studentId });
    if (existingApp) {
      return res.status(400).json({ message: 'You have already applied to this internship.' });
    }

    // Calculate baseline Match Score (Keyword overlap)
    const matches = job.requiredSkills.filter(s => 
      student.skills.map(us => us.toLowerCase()).includes(s.toLowerCase())
    );
    const matchScore = job.requiredSkills.length > 0 
      ? Math.round((matches.length / job.requiredSkills.length) * 100) 
      : 0;

    const newApplication = new Application({
      jobId,
      studentId,
      companyId: job.companyId,
      matchScore
    });

    await newApplication.save();
    res.status(201).json({ message: 'Application submitted successfully.', application: newApplication });
  } catch (error) {
    // 11000 is MongoDB's duplicate key error code (from our schema index)
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already applied to this internship.' });
    }
    res.status(500).json({ message: 'Error submitting application.', error: error.message });
  }
});

// GET: Company fetches their inbox (All applications for their jobs)
router.get('/company/:companyId', async (req, res) => {
  try {
    // We use .populate() to pull in the actual Student and Job details, not just IDs
    const applications = await Application.find({ companyId: req.params.companyId })
      .populate('studentId', 'name email skills')
      .populate('jobId', 'title')
      .sort({ matchScore: -1 }); // Rank highest matches first

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applications.', error: error.message });
  }
});

// PUT: Company approves or rejects an application
router.put('/:applicationId/status', async (req, res) => {
  try {
    const { status } = req.body; // 'Approved' or 'Rejected'
    
    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status update.' });
    }

    const application = await Application.findByIdAndUpdate(
      req.params.applicationId,
      { status },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ message: 'Application not found.' });
    }

    res.status(200).json({ message: `Application ${status.toLowerCase()} successfully.`, application });
  } catch (error) {
    res.status(500).json({ message: 'Error updating application status.', error: error.message });
  }
});

// GET: Student fetches their own applications (To check if Approved/Rejected)
router.get('/student/:studentId', async (req, res) => {
  try {
    const applications = await Application.find({ studentId: req.params.studentId })
      .populate('jobId', 'title companyName') // Pull in the job title and company name
      .sort({ appliedAt: -1 });

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching your applications.', error: error.message });
  }
});

module.exports = router;