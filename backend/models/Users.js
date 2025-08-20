const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please provide an email.'],
    unique: true,
  },
  fullname: {
    type: String,
    required: [true, 'Please provide full name.'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password.'],
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
});

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);