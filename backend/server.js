// THIS MUST BE LINE 1. NO EXCEPTIONS.
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const adminRoutes = require('./routes/adminRoutes');
const engineRoutes = require('./routes/engineRoutes');

console.log("🔍 URI CHECK:", process.env.MONGO_URI ? "Found" : "Missing");

const app = express();

// --- MIDDLEWARE ---
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.use((req, res, next) => {
  console.log(`📡 INCOMING: ${req.method} request to ${req.url}`);
  next();
});

// --- DATABASE CONNECTION ---
let isConnected = false;

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState === 1) {
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log(`✅ MongoDB Engine Online: ${conn.connection.host}`);
  } catch (err) {
    console.error('❌ MongoDB Connection Failed:', err.message);
  }
};

// Initialize DB connection
connectDB();

// --- BASE & HEALTH CHECK ROUTES ---
app.get('/', (req, res) => {
  res.status(200).json({ status: 'online', message: 'Smart Allocation Engine Backend API is active.' });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'active', message: 'Engine is running.' });
});

// --- ROUTE INTEGRATION ---
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/internships', require('./routes/internshipRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/admin', adminRoutes);
app.use('/api/engine', engineRoutes);
app.use('/api/ai', require('./routes/aiRoutes'));

// --- GLOBAL ERROR NET ---
app.use((err, req, res, next) => {
  console.error("🔥 EXPRESS ERROR:", err.stack);
  res.status(500).json({ message: 'Internal Engine Failure', error: err.message });
});

const PORT = process.env.PORT || 5000;

// Local development listener
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server initialized on port ${PORT}`);
  });
}

// Export for Vercel serverless execution
module.exports = app;