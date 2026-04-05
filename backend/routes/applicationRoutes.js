const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Internship = require('../models/Internship');
const { protect } = require('../middleware/authMiddleware');
const { runEngineForStudent } = require('../services/allocationEngine');

// POST: Apply for an internship
router.post('/apply/:jobId', protect, async (req, res) => {
  try {
    // Security Check
    if (req.user.role !== 'Student') {
      return res.status(403).json({ message: 'Only students can apply for internships.' });
    }

    const jobId = req.params.jobId;
    const student = req.user;

    // Job Validation
    const job = await Internship.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Internship not found.' });
    }
    if (job.status !== 'Active') {
      return res.status(400).json({ message: 'This internship is no longer accepting applications.' });
    }

    // Duplicate Check
    const existingApplication = await Application.findOne({ student: student._id, job: jobId });
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this internship.' });
    }

    // Run the Engine for this specific job to get the official frozen Match Score
    const engineResult = runEngineForStudent(student, [job]);
    const finalScore = engineResult.length > 0 ? engineResult[0].matchScore : 0;

    // Create the Application Receipt
    const application = new Application({
      student: student._id,
      job: job._id,
      company: job.companyId, 
      matchScore: finalScore
    });

    await application.save();

    // Increment the applicant counter on the Internship document
    job.applicants += 1;
    await job.save();

    res.status(201).json({ 
      message: 'Application submitted successfully.',
      applicationId: application._id,
      matchScore: finalScore
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Duplicate application detected.' });
    }
    console.error("🚨 APPLICATION FAILURE:", error);
    res.status(500).json({ message: `Engine Failure: ${error.message}` });
  }
});

// GET: Fetch applications for a specific student
router.get('/student', protect, async (req, res) => {
  try {
    if (req.user.role !== 'Student') return res.status(403).json({ message: 'Access denied.' });
    
    const applications = await Application.find({ student: req.user._id })
      .populate('job', 'role companyName location stipend')
      .sort({ appliedAt: -1 });
      
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch applications.', error: error.message });
  }
});

module.exports = router;