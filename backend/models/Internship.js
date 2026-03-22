const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyName: { type: String, required: true },
  role: { type: String, required: true },
  description: { type: String },
  // Store skills as an array of strings for the AI Engine to calculate matches
  skills: [{ type: String }],
  stipend: { type: String },
  duration: { type: String },
  location: { type: String },
  capacity: { type: Number, default: 1 },
  applicants: { type: Number, default: 0 },
  status: { type: String, default: 'Active' } // 'Active' or 'Closed'
}, { timestamps: true });

module.exports = mongoose.model('Internship', internshipSchema);