/**
 * @file courses.js
 * @description Routes for managing courses.
 */

const express = require('express');
const router = express.Router();
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  toggleCourseStatus
} = require('./course.controller');
const { protect } = require('../../../middleware/authentication/authMiddleware');
const { authorize } = require('../../../middleware/authorization/roleMiddleware');
const jwt = require('jsonwebtoken');
const User = require('../users/user.model');
const { validate } = require('../../../middleware/validationMiddleware');
const { courseSchema } = require('../../../validators/schemas');

// Optional auth helper for GET / (Allows public access but attaches user if token exists)
const optionalProtect = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'YOUR_JWT_SUPER_SECRET_KEY');
      const user = await User.findById(decoded.id).populate('role');

      if (user && user.status === 'active') {
        req.user = {
          id: user._id.toString(),
          role: user.role.name
        };
      }
    } catch (error) {
      // Ignore token errors for optional auth, just proceed as public user
    }
  }
  next();
};

router.get('/', optionalProtect, getCourses);
router.get('/:id', optionalProtect, getCourseById);
router.post('/', protect, authorize('Admin'), validate(courseSchema), createCourse); // Note: authorize uses exactly what req.user.role is
router.put('/:id', protect, authorize('Admin'), validate(courseSchema), updateCourse);
router.delete('/:id', protect, authorize('Admin'), toggleCourseStatus);

module.exports = router;
