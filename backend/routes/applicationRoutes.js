const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware'); // Ensures only logged-in users can apply
const Application = require('../models/Application');
const Internship = require('../models/Internship');

// POST: Process an allocation request from the AI Terminal
router.post('/apply', protect, async (req, res) => {
  try {
    const { internshipId } = req.body;

    // 1. Validation Check
    if (!internshipId) {
      return res.status(400).json({ message: 'Engine Error: Missing pipeline ID.' });
    }

    // 2. Verify the job actually exists in the database
    const job = await Internship.findById(internshipId);
    if (!job) {
      return res.status(404).json({ message: 'Engine Error: Pipeline no longer exists or was closed.' });
    }

    // 3. Prevent Duplicate Spam
    // We check if this exact user already applied to this exact job
    const existingApplication = await Application.findOne({
      student: req.user._id,
      internship: internshipId
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already requested allocation for this specific pipeline.' });
    }

    // 4. Execute the Database Write
    const newApplication = await Application.create({
      student: req.user._id,
      internship: internshipId,
      status: 'Pending' // Always starts as pending for the company dashboard
    });

    res.status(201).json({ 
      message: 'Allocation request successfully transmitted.',
      applicationId: newApplication._id
    });

  } catch (error) {
    console.error("🚨 APPLICATION TRANSMISSION FAILURE:", error);
    res.status(500).json({ message: `System Failure: ${error.message}` });
  }
});

module.exports = router;