const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const adminRoutes = require('./routes/adminRoutes');
require('dotenv').config();
console.log("🔍 URI CHECK:", process.env.MONGO_URI);

const app = express();

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(`📡 INCOMING: ${req.method} request to ${req.url}`);
  next();
});

// --- DATABASE IGNITION ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Engine Online'))
  .catch((err) => {
    console.error('❌ FATAL: MongoDB Connection Failed');
    console.error(err);
    process.exit(1);
  });

// --- ROUTE INTEGRATION ---
// We map your route files to actual URL paths
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/internships', require('./routes/internshipRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/admin', adminRoutes);
app.use('/api/ai', require('./routes/aiRoutes'));

// Fallback health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'active', message: 'Engine is running.' });
});

const PORT = process.env.PORT || 5000;
// --- GLOBAL ERROR NET ---
app.use((err, req, res, next) => {
  console.error("🔥 FATAL EXPRESS ERROR:", err.stack);
  res.status(500).json({ message: 'Internal Engine Failure', error: err.message });
});
app.listen(PORT, () => {
  console.log(`🚀 Server initialized on port ${PORT}`);
});