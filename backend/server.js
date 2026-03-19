const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Allows us to parse JSON bodies in requests

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch((err) => {
      console.error('MongoDB Connection Failed. Check your connection string and password.');
      console.error(err.message);
      process.exit(1); // Kill the server if the database fails to connect
  });

// API Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/internships', require('./routes/internshipRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
// Existing routes...
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
// Add the new routes here:
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