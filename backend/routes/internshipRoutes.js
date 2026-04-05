const express = require('express');
const router = express.Router();
const Internship = require('../models/Internship');
const { protect } = require('../middleware/authMiddleware'); // <--- ADD THIS

// POST: Create a new internship (SECURED)
router.post('/', protect, async (req, res) => {
  try {
    // Check if the user is actually a Company
    if (req.user.role !== 'Company') {
      return res.status(403).json({ message: 'Access denied. Only companies can post.' });
    }

    const { role, description, skills, stipend, duration, location, capacity } = req.body;

    const cleanSkills = typeof skills === 'string' 
      ? skills.split(',').map(s => s.trim()).filter(s => s) 
      : skills;

    const newInternship = new Internship({
      companyId: req.user._id, // <--- GET FROM TOKEN, NOT REQ.BODY (Secure)
      companyName: req.user.name, // <--- GET FROM TOKEN
      role,
      description,
      skills: cleanSkills,
      stipend,
      duration,
      location,
      capacity
    });

    const savedInternship = await newInternship.save();
    res.status(201).json(savedInternship);
  } catch (error) {
    res.status(500).json({ message: 'Error creating internship', error: error.message });
  }
});

// GET: Fetch ALL active internships (Public for students)
router.get('/', async (req, res) => {
  try {
    const internships = await Internship.find({ status: 'Active' }).sort({ createdAt: -1 });
    res.status(200).json(internships);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching internships', error: error.message });
  }
});

module.exports = router;