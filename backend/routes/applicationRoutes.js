const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Application = require('../models/Application');
const Internship = require('../models/Internship');

// =====================================================================
// 1. POST: Process an allocation request from the AI Terminal (Student)
// =====================================================================
router.post('/apply', protect, async (req, res) => {
  try {
    const { internshipId } = req.body;

    if (!internshipId) {
      return res.status(400).json({ message: 'Engine Error: Missing pipeline ID.' });
    }

    const job = await Internship.findById(internshipId);
    if (!job) {
      return res.status(404).json({ message: 'Engine Error: Pipeline no longer exists.' });
    }

    // Prevent Duplicate Spam
    const existingApplication = await Application.findOne({
      student: req.user._id,
      internship: internshipId
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already requested allocation for this specific pipeline.' });
    }

    // 1. Create the application receipt
    const newApplication = await Application.create({
      student: req.user._id,
      internship: internshipId,
      status: 'Pending'
    });

    // 2. Increment the applicant counter on the Internship document
    await Internship.findByIdAndUpdate(internshipId, { $inc: { applicants: 1 } });

    // 3. Send final success response
    res.status(201).json({ 
      message: 'Allocation request successfully transmitted.',
      applicationId: newApplication._id
    });

  } catch (error) {
    console.error("🚨 APPLICATION TRANSMISSION FAILURE:", error);
    res.status(500).json({ message: `System Failure: ${error.message}` });
  }
});

// =====================================================================
// 2. GET: Fetch all applications for the logged-in company (Dashboard)
// =====================================================================
router.get('/company-dashboard', protect, async (req, res) => {
  try {
    // Find every internship this specific company has created
    const companyInternships = await Internship.find({ company: req.user._id }).select('_id');
    
    // Extract those IDs into a clean array
    const internshipIds = companyInternships.map(internship => internship._id);

    // If they haven't posted any jobs, return empty array
    if (internshipIds.length === 0) {
      return res.status(200).json([]); 
    }

    // Find all applications where the "internship" ID matches ANY ID in our array
    // Populate the student and internship details so the frontend can display text, not just IDs
    const applications = await Application.find({ internship: { $in: internshipIds } })
      .populate('student', 'name email') 
      .populate('internship', 'role companyName'); 

    res.status(200).json(applications);

  } catch (error) {
    console.error("🚨 DASHBOARD FETCH FAILURE:", error);
    res.status(500).json({ message: `System Failure: ${error.message}` });
  }
});

module.exports = router;