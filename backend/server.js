require('dotenv').config(); // Load environment variables ONCE
const express = require('express'); // YOU NEED THIS
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); 

// Database Connection
// CRITICAL: Ensure your .env file explicitly uses MONGODB_URI to match this line.
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch((err) => {
      console.error('❌ MongoDB Connection Failed. Check your connection string and password.');
      console.error(err.message);
      process.exit(1); 
  });

// API Routes (Cleaned up, no duplicates)
app.use('/api/internships', require('./routes/internshipRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/internships', require('./routes/internshipRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));

// Health Check Route
app.get('/api/status', (req, res) => {
  res.json({ message: 'AI Allocation Engine API is running perfectly.' });
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});