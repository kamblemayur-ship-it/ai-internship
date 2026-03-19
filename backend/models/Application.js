const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // For easier querying by the company
  matchScore: { type: Number, required: true }, // Store the AI's percentage
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  appliedAt: { type: Date, default: Date.now }
});

// Prevent a student from applying to the same job twice
applicationSchema.index({ jobId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);