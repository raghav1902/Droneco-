/**
 * @file authMiddleware.js
 * @description Middleware to protect routes by validating JWT tokens.
 */

const jwt = require('jsonwebtoken');
const { users } = require('../../database/store');

const protect = (req, res, next) => {
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

      // Get user from the in-memory store
      const user = users.find(u => u.id === decoded.id);

      if (!user) {
        return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
      }

      if (user.status !== 'active') {
        return res.status(401).json({ success: false, message: 'User account is deactivated' });
      }

      // Attach user to request (excluding password)
      const { password, ...userWithoutPassword } = user;
      req.user = userWithoutPassword;
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

module.exports = { protect };
