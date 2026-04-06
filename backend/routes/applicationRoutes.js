const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Internship = require('../models/Internship');
const { protect } = require('../middleware/authMiddleware');

// POST: Apply for an internship
router.post('/:jobId', protect, async (req, res) => {
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

    // --- INLINE AI MATCHING ENGINE (BULLETPROOFED) ---
    // Fallback to empty arrays if the database fields are missing or undefined
    const safeStudentSkills = Array.isArray(student.skills) ? student.skills : [];
    const safeJobSkills = Array.isArray(job.skills) ? job.skills : [];

    const studentSkills = safeStudentSkills.map(s => s.toLowerCase());
    const jobSkills = safeJobSkills.map(s => s.toLowerCase());
    
    let matchCount = 0;
    jobSkills.forEach(skill => {
      if (studentSkills.includes(skill)) matchCount++;
    });

    let finalScore = jobSkills.length > 0 ? Math.round((matchCount / jobSkills.length) * 100) : 50;
    if (finalScore > 0 && finalScore < 100) finalScore += Math.floor(Math.random() * 8); 
    if (finalScore > 99) finalScore = 99;

    // Create the Application Receipt
    const application = new Application({
      student: student._id,
      job: job._id,
      company: job.company, 
      matchScore: finalScore
    });

    await application.save();

    // Safely increment applicants (fallback to 0 if undefined)
    job.applicants = (job.applicants || 0) + 1;
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

// GET: Fetch all applicants for a company
router.get('/company', protect, async (req, res) => {
  try {
    if (req.user.role !== 'Company') {
      return res.status(403).json({ message: 'Access denied. Companies only.' });
    }
    
    const applications = await Application.find({ company: req.user._id })
      .populate('student', 'name email skills phone address')
      .populate('job', 'role')
      .sort({ matchScore: -1 }); // Highest match scores bubble to the top
      
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch applicants.', error: error.message });
  }
});

// PUT: Update application status (Accept/Reject)
router.put('/:id/status', protect, async (req, res) => {
  try {
    if (req.user.role !== 'Company') return res.status(403).json({ message: 'Access denied.' });

    const { status } = req.body;
    const application = await Application.findById(req.params.id);
    
    if (!application) return res.status(404).json({ message: 'Application not found.' });
    
    // Security measure: Ensure the company modifying the status actually owns the job
    if (application.company.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'You do not have permission to modify this application.' });
    }
    
    application.status = status;
    await application.save();
    
    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update status.', error: error.message });
  }
});

module.exports = router;