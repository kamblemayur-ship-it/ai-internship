const express = require('express');
const router = express.Router();
const Job = require('../models/Job');

// POST: Company creates a new job posting
router.post('/', async (req, res) => {
  try {
    const { companyId, companyName, title, description, requiredSkills } = req.body;

    // Basic validation
    if (!companyId || !title || !requiredSkills || requiredSkills.length === 0) {
      return res.status(400).json({ message: 'Missing required job fields or skills.' });
    }

    const newJob = new Job({
      companyId,
      companyName,
      title,
      description,
      requiredSkills
    });

    await newJob.save();
    res.status(201).json({ message: 'Job posted successfully.', job: newJob });
  } catch (error) {
    res.status(500).json({ message: 'Error creating job.', error: error.message });
  }
});

// GET: Fetch all OPEN jobs (For the Student Live Feed)
router.get('/open', async (req, res) => {
  try {
    const jobs = await Job.find({ status: 'Open' }).sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching jobs.', error: error.message });
  }
});

// GET: Fetch jobs posted by a specific company (For Company Dashboard)
router.get('/company/:companyId', async (req, res) => {
  try {
    const jobs = await Job.find({ companyId: req.params.companyId }).sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching company jobs.', error: error.message });
  }
});

module.exports = router;