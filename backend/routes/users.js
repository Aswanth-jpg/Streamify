const express = require('express');
const User = require('../models/Users');

const router = express.Router();

// GET /api/users/count - total number of users
router.get('/count', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({});
    return res.status(200).json({ count: totalUsers });
  } catch (error) {
    console.error('Error fetching users count:', error);
    return res.status(500).json({ message: 'Server error.' });
  }
});

// Optional: list users (minimal fields)
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}, 'email fullname role');
    return res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;


