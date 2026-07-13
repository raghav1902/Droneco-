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
  deleteQuestion
} = require('../controllers/question.controller');
const { protect } = require('../middleware/authentication/authMiddleware');
const { authorize } = require('../middleware/authorization/roleMiddleware');
const jwt = require('jsonwebtoken');
const { users } = require('../database/store');
const { validate } = require('../middleware/validationMiddleware');
const { createQuestionSchema } = require('../validators/schemas');

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
router.post('/', protect, authorize('admin'), validate(createQuestionSchema), createQuestion);
router.put('/:id', protect, authorize('admin'), validate(createQuestionSchema), updateQuestion);
router.delete('/:id', protect, authorize('admin'), deleteQuestion);

module.exports = router;
