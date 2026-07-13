/**
 * @file courseController.js
 * @description Controller for managing courses offered by the institute.
 */

const Course = require('../models/course.model');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public (returns active only) / Private (returns all for Admin)
const getCourses = async (req, res) => {
  try {
    // If request has authorization and user is admin, return all courses. Otherwise, only active ones.
    const isAdmin = req.user && req.user.role === 'Admin'; // Role names are uppercase based on Role schema

    const query = isAdmin ? {} : { is_active: true };

    const courses = await Course.find(query).sort({ created_at: -1 });

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ success: false, message: 'Server error fetching courses' });
  }
};

// @desc    Get a single course by ID
// @route   GET /api/courses/:id
// @access  Public (if active) / Private (Admin can view inactive)
const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const isAdmin = req.user && req.user.role === 'Admin';
    if (!course.is_active && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to view inactive course' });
    }

    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error('Error fetching course:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid course ID format' });
    }
    res.status(500).json({ success: false, message: 'Server error fetching course' });
  }
};

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private (Admin only)
const createCourse = async (req, res) => {
  try {
    const { course_name, code, description, duration_months } = req.body;

    // We can rely on Mongoose validation, but checking explicitly gives better UX messages
    if (!course_name || !code || !duration_months) {
      return res.status(400).json({ success: false, message: 'Please provide course name, code, and duration' });
    }

    const newCourse = await Course.create({
      course_name,
      code,
      description,
      duration_months
    });

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: newCourse
    });
  } catch (error) {
    console.error('Error creating course:', error);
    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({ success: false, message: `A course with this ${field} already exists` });
    }
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server error creating course' });
  }
};

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private (Admin only)
const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { course_name, code, description, duration_months, is_active } = req.body;

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Update fields if provided
    if (course_name) course.course_name = course_name;
    if (code) course.code = code;
    if (description !== undefined) course.description = description;
    if (duration_months !== undefined) course.duration_months = duration_months;
    if (is_active !== undefined) course.is_active = is_active;

    if (req.body.fee_structure) {
      if (!course.fee_structure) course.fee_structure = {};
      if (req.body.fee_structure.total_fee !== undefined) {
        course.fee_structure.total_fee = req.body.fee_structure.total_fee;
      }
      if (req.body.fee_structure.installments_allowed !== undefined) {
        course.fee_structure.installments_allowed = req.body.fee_structure.installments_allowed;
      }
    }

    const updatedCourse = await course.save();

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: updatedCourse
    });
  } catch (error) {
    console.error('Error updating course:', error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({ success: false, message: `A course with this ${field} already exists` });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid course ID format' });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server error updating course' });
  }
};

// @desc    Toggle course active status (soft delete/reactivate)
// @route   DELETE /api/courses/:id
// @access  Private (Admin only)
const toggleCourseStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    course.is_active = !course.is_active;
    await course.save();

    res.status(200).json({
      success: true,
      message: `Course ${course.is_active ? 'activated' : 'deactivated'} successfully`,
      data: course
    });
  } catch (error) {
    console.error('Error toggling course status:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid course ID format' });
    }
    res.status(500).json({ success: false, message: 'Server error updating course status' });
  }
};

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  toggleCourseStatus
};
