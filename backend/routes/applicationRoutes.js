const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const { protect } = require('../middleware/authMiddleware');

// POST: Apply to an internship
router.post('/apply', protect, async (req, res) => {
  try {
    const { internshipId, matchScore } = req.body;
    
    if (!internshipId) {
      return res.status(400).json({ message: 'Internship ID is required.' });
    }

    const existingApplication = await Application.findOne({
      student: req.user._id,
      internship: internshipId
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied to this internship.' });
    }

    const application = new Application({
      student: req.user._id,
      internship: internshipId,
      matchScore: Number(matchScore) || 0,
      status: 'Pending',
      appliedAt: new Date()
    });

    await application.save();
    
    // Return populated application for immediate frontend state updates
    await application.populate('internship');

    res.status(201).json({ 
      message: 'Application submitted successfully.', 
      application 
    });
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({ message: error.message });
  }
});

// Helper handler to fetch applications
const getStudentApplications = async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user._id })
      .populate('internship')
      .sort({ appliedAt: -1 });

    res.status(200).json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: error.message });
  }
};

// GET: Fetch applications for the logged-in student (supports both route aliases)
router.get('/my-applications', protect, getStudentApplications);
router.get('/student', protect, getStudentApplications);

module.exports = router;