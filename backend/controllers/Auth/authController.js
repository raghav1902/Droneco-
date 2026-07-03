/**
 * @file authController.js
 * @description Controller for staff authentication (login, profile verification).
 */

const jwt = require('jsonwebtoken');
const { users } = require('../../database/store');

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password' });
  }

  // Find user in in-memory store
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

  // Check if user exists and password matches (plain-text comparison for in-memory phase)
  if (user && user.password === password) {
    if (user.status !== 'active') {
      return res.status(401).json({ success: false, message: 'Account is deactivated' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'YOUR_JWT_SUPER_SECRET_KEY',
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    return res.status(200).json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token
      }
    });
  } else {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = (req, res) => {
  // req.user is attached by the protect middleware
  res.status(200).json({
    success: true,
    data: req.user
  });
};

module.exports = {
  loginUser,
  getMe
};
