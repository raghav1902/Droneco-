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
const { protect, optionalProtect } = require('../middleware/authentication/authMiddleware');
const { authorize } = require('../middleware/authorization/roleMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const { createQuestionSchema } = require('../validators/schemas');

router.get('/', optionalProtect, getQuestions);
router.post('/', protect, authorize('admin'), validate(createQuestionSchema), createQuestion);
router.put('/:id', protect, authorize('admin'), validate(createQuestionSchema), updateQuestion);
router.delete('/:id', protect, authorize('admin'), deleteQuestion);

module.exports = router;
