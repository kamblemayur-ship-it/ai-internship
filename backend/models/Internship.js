const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyName: { type: String, required: true },
  role: { type: String, required: true },
  description: { type: String },
  skills: [{ type: String }], // The AI Engine reads this array
  stipend: { type: String },
  duration: { type: String },
  location: { type: String },
  capacity: { type: Number, default: 1 },
  applicants: { type: Number, default: 0 },
  status: { type: String, enum: ['Active', 'Closed'], default: 'Active' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Internship', internshipSchema);