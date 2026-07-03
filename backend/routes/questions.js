/**
 * @file questions.js
 * @description Routes for managing dynamic wizard questions.
 */

const express = require('express');
const router = express.Router();
const {
  getQuestions,
  createQuestion,
  updateQuestion,
  toggleQuestionStatus
} = require('../controllers/Lead/questionController');
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

router.get('/', optionalProtect, getQuestions);
router.post('/', protect, authorize('admin'), createQuestion);
router.put('/:id', protect, authorize('admin'), updateQuestion);
router.delete('/:id', protect, authorize('admin'), toggleQuestionStatus);

module.exports = router;
