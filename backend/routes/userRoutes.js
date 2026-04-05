const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware'); // IMPORTED

// --- PUBLIC ROUTES ---

// POST: Register a new user
router.post('/register', async (req, res) => {
  try {
    console.log("\n📥 REGISTRATION PAYLOAD RECEIVED:", req.body);
    const { name, email, password, role, skills } = req.body;
    
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const formattedRole = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
    let cleanSkills = Array.isArray(skills) ? skills.map(s => String(s).trim()).filter(s => s.length > 0) : [];

    if (formattedRole === 'Student' && cleanSkills.length === 0) {
      return res.status(400).json({ message: 'Students must provide technical skills.' });
    }

    let user = await User.findOne({ email: email.toLowerCase() });
    if (user) return res.status(400).json({ message: 'User already exists.' });

    user = new User({ name, email: email.toLowerCase(), password, role: formattedRole, skills: cleanSkills });
    await user.save();
    
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    res.status(500).json({ message: `Engine Failure: ${error.message}` });
  }
});

// POST: Login a user
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) return res.status(400).json({ message: 'Missing credentials.' });

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) return res.status(400).json({ message: 'Invalid credentials.' });

    // Case-insensitive role check
    if (user.role.toLowerCase() !== role.toLowerCase()) {
      return res.status(403).json({ message: `Role mismatch. Registered as ${user.role}.` });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials.' });

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token, user: { id: user._id, name: user.name, role: user.role, skills: user.skills } });
  } catch (error) {
    res.status(500).json({ message: `Login Failure: ${error.message}` });
  }
});

// --- PROTECTED ROUTES (Requires Token) ---

/**
 * @desc    Get current user profile
 * @route   GET /api/users/me
 * @access  Private
 */
router.get('/me', protect, async (req, res) => {
  try {
    // req.user is attached by the protect middleware
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching self profile' });
  }
});

// GET: Fetch specific user profile (Now Protected)
router.get('/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile.' });
  }
});

module.exports = router;  