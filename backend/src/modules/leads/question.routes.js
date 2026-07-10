/**
 * @file questionRoutes.js
 * @description Routes for managing dynamic questions.
 */

const express = require('express');
const router = express.Router();
const {
  getQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion
} = require('./question.controller');
const { protect } = require('../../../middleware/authentication/authMiddleware');
const { authorize } = require('../../../middleware/authorization/roleMiddleware');

// Public route to get all active questions (for the Student Form)
router.get('/', getQuestions);

// Protected routes (Admin only)
router.use(protect);
router.use(authorize('admin')); // Only admin can manage questions

router.route('/')
  .post(createQuestion);

router.route('/:id')
  .get(getQuestionById)
  .put(updateQuestion)
  .delete(deleteQuestion);

module.exports = router;
