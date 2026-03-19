const mongoose = require('mongoose');

const InternshipSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  description: { type: String, required: true },
  requiredSkills: [{ type: String }], // Skills the AI will match against student skills
  allocatedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Links to User database
}, { timestamps: true });

module.exports = mongoose.model('Internship', InternshipSchema);