/**
 * @file questionController.js
 * @description Controller for managing dynamic form questions using MongoDB.
 */

const Question = require('./question.model');

// @desc    Get all active questions
// @route   GET /api/questions
// @access  Public
const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find({ is_active: true }).sort({ order: 1, created_at: -1 });

    res.status(200).json({
      success: true,
      count: questions.length,
      data: questions
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ success: false, message: 'Server error fetching questions' });
  }
};

// @desc    Get a single question by ID
// @route   GET /api/questions/:id
// @access  Private (Admin)
const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    res.status(200).json({
      success: true,
      data: question
    });
  } catch (error) {
    console.error('Error fetching question:', error);
    res.status(500).json({ success: false, message: 'Server error fetching question' });
  }
};

// @desc    Create a new question
// @route   POST /api/questions
// @access  Private (Admin)
const createQuestion = async (req, res) => {
  try {
    const { question_text, type, options, is_required, is_active, order } = req.body;

    // Validate dropdown/checkbox/radio types require options
    if (['dropdown', 'checkbox', 'radio'].includes(type) && (!options || options.length === 0)) {
      return res.status(400).json({ success: false, message: 'Options are required for dropdown, checkbox, and radio types' });
    }

    const question = await Question.create({
      question_text,
      type,
      options: options || [],
      is_required: is_required !== undefined ? is_required : false,
      is_active: is_active !== undefined ? is_active : true,
      order: order || 0
    });

    res.status(201).json({
      success: true,
      message: 'Question created successfully',
      data: question
    });
  } catch (error) {
    console.error('Error creating question:', error);
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server error creating question' });
  }
};

// @desc    Update a question
// @route   PUT /api/questions/:id
// @access  Private (Admin)
const updateQuestion = async (req, res) => {
  try {
    let question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    const { question_text, type, options, is_required, is_active, order } = req.body;

    // Validate dropdown/checkbox/radio types require options
    const newType = type || question.type;
    const newOptions = options !== undefined ? options : question.options;
    if (['dropdown', 'checkbox', 'radio'].includes(newType) && (!newOptions || newOptions.length === 0)) {
      return res.status(400).json({ success: false, message: 'Options are required for dropdown, checkbox, and radio types' });
    }

    question = await Question.findByIdAndUpdate(
      req.params.id,
      {
        question_text,
        type,
        options,
        is_required,
        is_active,
        order
      },
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Question updated successfully',
      data: question
    });
  } catch (error) {
    console.error('Error updating question:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server error updating question' });
  }
};

// @desc    Soft delete a question (toggle is_active)
// @route   DELETE /api/questions/:id
// @access  Private (Admin)
const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    question.is_active = !question.is_active; // Toggle status
    await question.save();

    res.status(200).json({
      success: true,
      message: `Question successfully ${question.is_active ? 'activated' : 'deactivated'}`,
      data: question
    });
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({ success: false, message: 'Server error deleting question' });
  }
};

module.exports = {
  getQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion
};
