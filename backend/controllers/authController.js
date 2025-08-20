const User = require('../models/Users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Login a user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // 1. Basic Validation
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide an email and password' });
  }

  try {
    // 2. Find user by email (and explicitly include password for comparison)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    // const isMatch = await bcrypt.compare(password, user.password);

    // if (!isMatch) {
    //   return res.status(401).json({ success: false, message: 'Invalid credentials' });
    // }

    // 4. Create JWT Payload
    const payload = {
      id: user._id,
      role: user.role,
    };

    // 5. Sign the token
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE || '1d', // Token expires in 1 day
    });

    // 6. Send token in response
    res.status(200).json({
      success: true,
      token: token,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};