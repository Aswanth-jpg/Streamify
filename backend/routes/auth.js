const express = require('express');
const User = require('../models/Users');
const jwt = require('jsonwebtoken');

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password, role } = req.body;
  console.log('Login attempt:', { email, role }); // Avoid logging passwords

  try {
    const user = await User.findOne({ email, role });

    if (!user) {
      console.log(`Login failed: No user found with email ${email} and role ${role}`);
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    
    // NOTE: This is an insecure way to compare passwords.
    // In a real application, you must use a library like bcrypt to hash passwords.
    if (password !== user.password) {
      console.log(`Login failed: Password incorrect for user ${email}`);
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // If credentials are correct, create a JSON Web Token (JWT)
    const payload = {
      userId: user._id,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(
      payload, 
      process.env.JWT_SECRET || 'your-default-secret-key', 
      {
        expiresIn: '1h', // Token will expire in 1 hour
      }
    );

    // Send the token back to the client
    res.status(200).json({
      token,
      user: { email: user.email, role: user.role }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, fullname, password } = req.body;

    if (!email || !fullname || !password) {
      return res.status(400).json({ message: 'Email, full name, and password are required.' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already in use.' });
    }

    const user = new User({ email, fullname, password, role: 'user' });
    await user.save();

    const payload = { userId: user._id, email: user.email, role: user.role };
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'your-default-secret-key',
      { expiresIn: '1h' }
    );

    return res.status(201).json({
      message: 'Registration successful.',
      token,
      user: { email: user.email, role: user.role, fullname: user.fullname }
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ message: 'Server error during registration.' });
  }
});


module.exports = router;