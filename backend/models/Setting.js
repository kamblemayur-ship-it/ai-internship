const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  // Global AI constraint
  minMatchScore: { type: Number, default: 50 },
  // Network security flags
  allowNewRegistrations: { type: Boolean, default: true },
  maintenanceMode: { type: Boolean, default: false }
});

module.exports = mongoose.model('Setting', settingSchema);