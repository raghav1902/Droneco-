/**
 * @file courses.js
 * @description Routes for managing courses.
 */

const express = require('express');
const router = express.Router();
const {
  getCourses,
  createCourse,
  updateCourse,
  toggleCourseStatus
} = require('../controllers/Lead/courseController');
const { protect } = require('../middleware/authentication/authMiddleware');
const { authorize } = require('../middleware/authorization/roleMiddleware');
const jwt = require('jsonwebtoken');
const { users } = require('../database/store');

// Optional auth helper for GET /
const optionalProtect = (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'YOUR_JWT_SUPER_SECRET_KEY');
      const user = users.find(u => u.id === decoded.id);
      if (user && user.status === 'active') {
        const { password, ...userWithoutPassword } = user;
        req.user = userWithoutPassword;
      }
    } catch (error) {
      // Ignore token errors for optional auth
    }
  }
  next();
};

router.get('/', optionalProtect, getCourses);
router.post('/', protect, authorize('admin'), createCourse);
router.put('/:id', protect, authorize('admin'), updateCourse);
router.delete('/:id', protect, authorize('admin'), toggleCourseStatus);

module.exports = router;
