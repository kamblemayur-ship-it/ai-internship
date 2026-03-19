const express = require('express');
const router = express.Router();
const Internship = require('../models/Internship');

// POST: Create a new internship
router.post('/', async (req, res) => {
  try {
    const { title, company, description, requiredSkills } = req.body;
    
    const newInternship = new Internship({ title, company, description, requiredSkills });
    await newInternship.save();
    
    res.status(201).json({ message: 'Internship created successfully', internship: newInternship });
  } catch (error) {
    res.status(500).json({ message: 'Error creating internship', error: error.message });
  }
});

// GET: Fetch all internships
router.get('/', async (req, res) => {
  try {
    const internships = await Internship.find();
    res.status(200).json(internships);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching internships', error: error.message });
  }
});

module.exports = router;