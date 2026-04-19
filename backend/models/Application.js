const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  // Link to the student who clicked "Request Allocation"
  student: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  // Link to the specific job they applied for
  internship: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Internship', 
    required: true 
  },
  // The state of the application in the company's dashboard
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

module.exports = mongoose.model('Application', applicationSchema);