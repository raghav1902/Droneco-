/**
 * @file authMiddleware.js
 * @description Middleware to protect routes by validating JWT tokens against MongoDB.
 */

const jwt = require('jsonwebtoken');
const User = require('../../models/user.model');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'YOUR_JWT_SUPER_SECRET_KEY');

      // Get user from the database
      const user = await User.findById(decoded.id).select('-password').populate('role');

      if (!user) {
        return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
      }

      if (user.status !== 'active') {
        return res.status(401).json({ success: false, message: 'User account is deactivated' });
      }

      // Check if user changed password after the token was issued
      if (user.changedPasswordAfter(decoded.iat)) {
        return res.status(401).json({ success: false, message: 'User recently changed password! Please log in again.' });
      }

      // Attach user to request
      req.user = {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone,
        profile_photo: user.profile_photo,
        role: user.role.name, // Extracting the string name of the role for easy access in controllers
        status: user.status
      };

      next();
    } catch (error) {
      console.error('JWT Verification Error:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
};

const optionalProtect = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'YOUR_JWT_SUPER_SECRET_KEY');
      const user = await User.findById(decoded.id).select('-password').populate('role');
      
      if (user && user.status === 'active') {
        req.user = {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          phone: user.phone,
          profile_photo: user.profile_photo,
          role: user.role.name,
          status: user.status
        };
      }
    } catch (error) {
      // Ignore token errors for optional auth
    }
  }
  next();
};

module.exports = { protect, optionalProtect };
