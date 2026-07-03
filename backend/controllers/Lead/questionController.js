/**
 * @file questionController.js
 * @description Controller for managing dynamic wizard questions (Step 2).
 */

const { generateId, questions } = require('../../database/store');

// @desc    Get all questions
// @route   GET /api/questions
// @access  Public (active only) / Private (all for Admin)
const getQuestions = (req, res) => {
  const isAdmin = req.user && req.user.role === 'admin';
  
  const result = isAdmin 
    ? questions 
    : questions.filter(q => q.is_active);

  // Sort by step_number, then created_at
  result.sort((a, b) => {
    if (a.step_number !== b.step_number) {
      return a.step_number - b.step_number;
    }
    return new Date(a.created_at) - new Date(b.created_at);
  });

  res.status(200).json({
    success: true,
    data: result
  });
};

// @desc    Create a new dynamic question
// @route   POST /api/questions
// @access  Private (Admin only)
const createQuestion = (req, res) => {
  const { question_text, step_number, field_type, options, is_required } = req.body;

  if (!question_text || !field_type) {
    return res.status(400).json({ success: false, message: 'Please provide question text and field type' });
  }

  const validTypes = ['text', 'dropdown', 'radio', 'checkbox'];
  if (!validTypes.includes(field_type)) {
    return res.status(400).json({ success: false, message: 'Invalid field type. Must be text, dropdown, radio, or checkbox' });
  }

  const newQuestion = {
    id: 'q_' + generateId(),
    question_text,
    step_number: Number(step_number) || 2, // Default to step 2 as per spec
    field_type,
    options: Array.isArray(options) ? options : [],
    is_required: !!is_required,
    is_active: true,
    created_at: new Date()
  };

  questions.push(newQuestion);

  res.status(201).json({
    success: true,
    message: 'Question created successfully',
    data: newQuestion
  });
};

// @desc    Update a dynamic question
// @route   PUT /api/questions/:id
// @access  Private (Admin only)
const updateQuestion = (req, res) => {
  const { id } = req.params;
  const { question_text, step_number, field_type, options, is_required, is_active } = req.body;

  const question = questions.find(q => q.id === id);
  if (!question) {
    return res.status(404).json({ success: false, message: 'Question not found' });
  }

  const validTypes = ['text', 'dropdown', 'radio', 'checkbox'];
  if (field_type && !validTypes.includes(field_type)) {
    return res.status(400).json({ success: false, message: 'Invalid field type' });
  }

  if (question_text !== undefined) question.question_text = question_text;
  if (step_number !== undefined) question.step_number = Number(step_number);
  if (field_type !== undefined) question.field_type = field_type;
  if (options !== undefined) question.options = Array.isArray(options) ? options : [];
  if (is_required !== undefined) question.is_required = !!is_required;
  if (is_active !== undefined) question.is_active = !!is_active;

  res.status(200).json({
    success: true,
    message: 'Question updated successfully',
    data: question
  });
};

// @desc    Toggle question active status
// @route   DELETE /api/questions/:id
// @access  Private (Admin only)
const toggleQuestionStatus = (req, res) => {
  const { id } = req.params;

  const question = questions.find(q => q.id === id);
  if (!question) {
    return res.status(404).json({ success: false, message: 'Question not found' });
  }

  question.is_active = !question.is_active;

  res.status(200).json({
    success: true,
    message: `Question ${question.is_active ? 'activated' : 'deactivated'} successfully`,
    data: question
  });
};

module.exports = {
  getQuestions,
  createQuestion,
  updateQuestion,
  toggleQuestionStatus
};
