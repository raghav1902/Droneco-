/**
 * @file authController.js
 * @description Controller for staff authentication (login, profile verification) using MongoDB.
 */

const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Role = require('../models/role.model');
const { logAudit } = require('../utils/auditLogger');

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
  );
};

// @desc    Register a new user (Admin / Receptionist)
// @route   POST /api/auth/register
// @access  Public (for seeding purposes initially)
const registerUser = async (req, res) => {
  try {
    const { name, email, password, roleId } = req.body; // Allow roleId to be passed

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields (name, email, password)' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    let role;
    if (req.user && req.user.role && req.user.role.toLowerCase() === 'admin' && roleId) {
      // Admin is explicitly creating a specific role
      role = await Role.findById(roleId);
    } else {
      // Default to unprivileged role for public signups or if no roleId is provided
      role = await Role.findOne({ name: 'Student' });
    }

    if (!role) {
      return res.status(500).json({ success: false, message: 'Role is missing from the system or invalid' });
    }

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password, // Pre-save hook hashes it
      role: role._id
    });

    if (user) {
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: role.name,
          token: generateToken(user._id)
        }
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('================ DIAGNOSTIC ERROR LOG ================');
    console.error('Error registering user:', error);
    console.error(`Name: ${error.name}`);
    console.error(`Message: ${error.message}`);
    console.error(`Stack: ${error.stack}`);
    console.error('======================================================');
    
    // Explicitly send the exact error message to the client temporarily
    res.status(500).json({ 
      success: false, 
      message: `Render Live Error: ${error.message}`,
      errorType: error.name
    });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Find user by email and include password for validation, also populate role
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password').populate('role');

    // Check user and password
    if (user && (await user.matchPassword(password))) {
      if (user.status !== 'active') {
        return res.status(401).json({ success: false, message: 'Account is deactivated' });
      }

      res.status(200).json({
        success: true,
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          profile_photo: user.profile_photo,
          role: user.role.name,
          token: generateToken(user._id)
        }
      });

      // Log successful login
      await logAudit(user._id, 'Login', 'Successful login', req.ip);
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    // req.user is attached by the protect middleware, which is already a clean object
    res.status(200).json({
      success: true,
      data: req.user
    });
  } catch (error) {
    console.error('Error getting profile:', error);
    res.status(500).json({ success: false, message: 'Server error fetching profile' });
  }
};

// @desc    Update current user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { name, phone, profile_photo } = req.body;

    // Find user using ID from protect middleware
    const user = await User.findById(req.user.id).populate('role');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Update fields if provided
    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (profile_photo !== undefined) user.profile_photo = profile_photo;

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        profile_photo: updatedUser.profile_photo,
        role: updatedUser.role.name
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ success: false, message: 'Server error updating profile' });
  }
};

// @desc    Change user password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide current and new passwords' });
    }

    // Find user and explicitly select password since it has select: false
    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if current password matches
    if (!(await user.matchPassword(currentPassword))) {
      return res.status(401).json({ success: false, message: 'Incorrect current password' });
    }

    // Update password (pre-save hook will hash it)
    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ success: false, message: 'Server error changing password' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  changePassword
};
