const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  student: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  job: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Internship', 
    required: true 
  },
  company: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  matchScore: { 
    type: Number, 
    required: true 
  }, // Frozen at the exact moment of application
  status: { 
    type: String, 
    enum: ['Pending', 'Reviewed', 'Accepted', 'Rejected'], 
    default: 'Pending' 
  },
  appliedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Database-level protection: A student cannot apply to the exact same internship twice.
applicationSchema.index({ student: 1, job: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);