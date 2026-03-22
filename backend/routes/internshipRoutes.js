const express = require('express');
const router = express.Router();
const Internship = require('../models/Internship');

// POST: Create a new internship (Called by Company Portal)
router.post('/', async (req, res) => {
  try {
    const { companyId, companyName, role, description, skills, stipend, duration, location, capacity } = req.body;

    // Clean the skills array (comma-separated string to array)
    const cleanSkills = typeof skills === 'string' 
      ? skills.split(',').map(s => s.trim()).filter(s => s) 
      : skills;

    const newInternship = new Internship({
      companyId,
      companyName,
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

// GET: Fetch internships specifically for one company (Called by Company Portal)
router.get('/company/:companyId', async (req, res) => {
  try {
    const internships = await Internship.find({ companyId: req.params.companyId }).sort({ createdAt: -1 });
    res.status(200).json(internships);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching company internships', error: error.message });
  }
});

// GET: Fetch ALL active internships (Called by Student Portal & Allo Chatbot)
router.get('/', async (req, res) => {
  try {
    const internships = await Internship.find({ status: 'Active' }).sort({ createdAt: -1 });
    res.status(200).json(internships);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all internships', error: error.message });
  }
});

module.exports = router;