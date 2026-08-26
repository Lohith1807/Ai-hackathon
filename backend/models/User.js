const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  otp: String,
  otpExpires: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.index({ email: 1 });

const User = mongoose.model('User', userSchema);
module.exports = User;
