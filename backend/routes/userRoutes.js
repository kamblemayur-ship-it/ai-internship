const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
  
// Strict Data Sanitization Helper
const sanitizeSkills = (skillsInput) => {
  if (!Array.isArray(skillsInput)) return [];
  
  return skillsInput
    .map(skill => typeof skill === 'string' ? skill.trim() : '')
    .filter(skill => skill.length > 0 && skill.length < 50); // Prevent 10,000-character spam
};


// POST: Register a new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, skills } = req.body;
    
    // 1. The Gatekeeper: Clean the skills array immediately
    const cleanSkills = sanitizeSkills(skills);

    if (role === 'student' && cleanSkills.length === 0) {
      return res.status(400).json({ message: 'Students must provide at least one valid technical skill.' });
    }

    // 2. Check if user exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists.' });

    // 3. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Save the new user with CLEAN skills
    user = new User({ 
      name, 
      email, 
      password: hashedPassword, 
      role, 
      skills: cleanSkills,
      status: 'Available' // Ensure new users are available for allocation
    });
    await user.save();
    
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration.', error: error.message });
  }
});

// POST: Login a user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials.' });

    const payload = { userId: user._id, role: user.role };
    // Make sure your .env has JWT_SECRET defined!
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1h' });

    res.status(200).json({ 
        token, 
        user: { id: user._id, name: user.name, role: user.role, skills: user.skills } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login.', error: error.message });
  }
});

// GET: Fetch all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// PUT: Update user profile (skills)
router.put('/:id', async (req, res) => {
  try {
    const { skills } = req.body;
    
    // The Gatekeeper: Clean the incoming update
    const cleanSkills = sanitizeSkills(skills);

    if (cleanSkills.length === 0) {
      return res.status(400).json({ message: 'Cannot update profile with empty skills.' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id, 
      { skills: cleanSkills }, 
      { new: true, runValidators: true } 
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
});

// POST: Allocate (Hire) a student
router.post('/allocate/:studentId', async (req, res) => {
  try {
    const { companyName } = req.body;
    
    const student = await User.findById(req.params.studentId);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found in database.' });
    }

    // The Lock: Race Condition Prevention
    if (student.status !== 'Available') {
      return res.status(400).json({ 
        message: `Allocation rejected. Student is already ${student.status}.` 
      });
    }

    student.status = `Allocated to ${companyName}`;
    const updatedStudent = await student.save();

    res.status(200).json({ message: 'Allocation successful.', student: updatedStudent });
  } catch (error) {
    res.status(500).json({ message: 'Failed to allocate student.', error: error.message });
  }
});

// GET: Fetch fresh user profile (to check status)
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile.', error: error.message });
  }
});

module.exports = router;