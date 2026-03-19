const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'company'], required: true },
  skills: { type: [String], default: [] },
  status: { type: String, default: 'Available' } // <-- ADD THIS LINE
});

module.exports = mongoose.model('User', userSchema);