const express = require('express');
const router = express.Router();
const User = require('../models/User');
// Assuming you have an Internship/Job model. If it's called Job.js, update this require.
const Job = require('../models/Internship'); 
const { runEngineForStudent } = require('../services/allocationEngine');

// GET: Generate matches for a specific student
router.get('/match/:studentId', async (req, res) => {
  try {
    const studentId = req.params.studentId;
    
    // 1. Fetch the student from DB
    const student = await User.findById(studentId);
    if (!student || student.role.toLowerCase() !== 'student') {
      return res.status(404).json({ message: 'Valid student record not found.' });
    }

    // 2. Fetch all ACTIVE jobs from DB
    // (You must ensure your Internship model has a 'status' field, or just fetch all)
    const activeJobs = await Job.find({ status: 'Active' });
    
    if (activeJobs.length === 0) {
      return res.status(200).json({ message: 'No active internships available to match.', matches: [] });
    }

    // 3. Define the weights (In a real app, fetch these from an Admin Settings DB collection)
    const systemWeights = {
      skills: 70,
      location: 20,
      availability: 10
    };

    // 4. Execute the Algorithm
    const topMatches = runEngineForStudent(student, activeJobs, systemWeights);

    // 5. Return the payload to React
    res.status(200).json({
      student: student.name,
      matchesFound: topMatches.length,
      matches: topMatches
    });

  } catch (error) {
    console.error("AI Engine Error:", error);
    res.status(500).json({ message: 'Failed to run allocation engine.', error: error.message });
  }
});

module.exports = router;