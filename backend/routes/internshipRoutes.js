const express = require('express');
const router = express.Router();
const Internship = require('../models/Internship');
const { protect } = require('../middleware/authMiddleware');

// @desc    Create a new internship requisition
// @route   POST /api/internships
// @access  Private (Company Only)
router.post('/', protect, async (req, res) => {
  try {
    if (req.user.role !== 'Company') {
      return res.status(403).json({ message: 'Engine locked: Only verified organizations can post requisitions.' });
    }

    // Convert comma-separated string back to array if needed
    let skillsArray = req.body.skills;
    if (typeof req.body.skills === 'string') {
      skillsArray = req.body.skills.split(',').map(s => s.trim());
    }

    const newInternship = new Internship({
      company: req.user._id,
      companyName: req.user.name,
      role: req.body.role,
      description: req.body.description,
      skills: skillsArray,
      stipend: req.body.stipend,
      duration: req.body.duration,
      location: req.body.location,
      capacity: req.body.capacity || 1
    });

    const savedInternship = await newInternship.save();
    res.status(201).json(savedInternship);
  } catch (error) {
    res.status(500).json({ message: 'Failed to deploy internship to network.', error: error.message });
  }
});

// @desc    Get all active internships (For Students & Admin)
// @route   GET /api/internships
// @access  Public or Private
router.get('/', async (req, res) => {
  try {
    const internships = await Internship.find({ status: 'Active' }).sort({ createdAt: -1 });
    res.status(200).json(internships);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch network opportunities.', error: error.message });
  }
});

// @desc    Get internships posted by a specific company
// @route   GET /api/internships/company/:companyId
// @access  Private
router.get('/company/:companyId', protect, async (req, res) => {
  try {
    const internships = await Internship.find({ company: req.params.companyId }).sort({ createdAt: -1 });
    res.status(200).json(internships);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch company requisitions.', error: error.message });
  }
});

module.exports = router;