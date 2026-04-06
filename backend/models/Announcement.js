const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  targetAudience: { 
    type: String, 
    enum: ['All', 'Students', 'Companies'], 
    default: 'All' 
  },
  priority: { 
    type: String, 
    enum: ['Standard', 'High', 'Critical'], 
    default: 'Standard' 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Announcement', announcementSchema);