const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false // Automatically hide password from API queries
  },
  role: {
    type: String,
    enum: ['Student', 'Company', 'Admin'],
    required: true
  },
  skills: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    default: 'Available'
  }
  // We can add profile data later (skills for students, website for companies)
}, { timestamps: true });

// Pre-save hook: Encrypt the password before saving to the database
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  // Removed next() entirely. Modern Mongoose resolves async functions automatically.
});

// Method to verify passwords during login
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);