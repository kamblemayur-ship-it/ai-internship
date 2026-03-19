const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyName: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  requiredSkills: { type: [String], required: true },
  status: { type: String, enum: ['Open', 'Closed'], default: 'Open' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', jobSchema);