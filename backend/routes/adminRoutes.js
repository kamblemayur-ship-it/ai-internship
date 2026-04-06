const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Announcement = require('../models/Announcement');
const Setting = require('../models/Setting');
const { protect, admin } = require('../middleware/authMiddleware');

// --- USER MANAGEMENT ---

// GET: All Students
router.get('/users/students', protect, admin, async (req, res) => {
  try {
    const students = await User.find({ role: 'Student' }).select('-password').sort({ createdAt: -1 });
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch student matrix', error: error.message });
  }
});

// GET: All Companies
router.get('/users/companies', protect, admin, async (req, res) => {
  try {
    const companies = await User.find({ role: 'Company' }).select('-password').sort({ createdAt: -1 });
    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch organization matrix', error: error.message });
  }
});

// --- ANNOUNCEMENTS (GLOBAL BROADCASTS) ---

// GET: Fetch all announcements
router.get('/announcements', protect, async (req, res) => {
  try {
    // Notice: We don't use 'admin' middleware here because students/companies need to read these too!
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.status(200).json(announcements);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch broadcasts', error: error.message });
  }
});

// POST: Create a new announcement
router.post('/announcements', protect, admin, async (req, res) => {
  try {
    const newAnnouncement = new Announcement(req.body);
    const savedAnnouncement = await newAnnouncement.save();
    res.status(201).json(savedAnnouncement);
  } catch (error) {
    res.status(500).json({ message: 'Failed to broadcast message', error: error.message });
  }
});

// --- ENGINE PARAMETERS (SETTINGS) ---

// GET: Fetch global settings
router.get('/settings', protect, admin, async (req, res) => {
  try {
    let settings = await Setting.findOne();
    // If no settings exist in DB yet, create the default ones
    if (!settings) {
      settings = await Setting.create({});
    }
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch engine parameters', error: error.message });
  }
});

// PUT: Update global settings
router.put('/settings', protect, admin, async (req, res) => {
  try {
    // Upsert: Update if exists, create if it doesn't. 
    // We only ever want ONE settings document in the database.
    const updatedSettings = await Setting.findOneAndUpdate(
      {}, 
      req.body, 
      { new: true, upsert: true }
    );
    res.status(200).json(updatedSettings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to overwrite engine parameters', error: error.message });
  }
});

module.exports = router;