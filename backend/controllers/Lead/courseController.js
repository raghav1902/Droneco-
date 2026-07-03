/**
 * @file courseController.js
 * @description Controller for managing courses offered by the institute.
 */

const { generateId, courses } = require('../../database/store');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public (returns active only) / Private (returns all for Admin)
const getCourses = (req, res) => {
  // If request has authorization and user is admin, return all courses. Otherwise, only active ones.
  const isAdmin = req.user && req.user.role === 'admin';
  
  const result = isAdmin 
    ? courses 
    : courses.filter(c => c.is_active);

  res.status(200).json({
    success: true,
    data: result
  });
};

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private (Admin only)
const createCourse = (req, res) => {
  const { course_name, code, description, duration_months } = req.body;

  if (!course_name || !code || !duration_months) {
    return res.status(400).json({ success: false, message: 'Please provide course name, code, and duration' });
  }

  // Check for duplicate code or name
  const duplicate = courses.find(
    c => c.code.toLowerCase() === code.toLowerCase() || 
         c.course_name.toLowerCase() === course_name.toLowerCase()
  );

  if (duplicate) {
    return res.status(400).json({ success: false, message: 'Course with this name or code already exists' });
  }

  const newCourse = {
    id: 'course_' + generateId(),
    course_name,
    code: code.toUpperCase(),
    description: description || '',
    duration_months: Number(duration_months),
    is_active: true,
    created_at: new Date()
  };

  courses.push(newCourse);

  res.status(201).json({
    success: true,
    message: 'Course created successfully',
    data: newCourse
  });
};

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private (Admin only)
const updateCourse = (req, res) => {
  const { id } = req.params;
  const { course_name, code, description, duration_months, is_active } = req.body;

  const course = courses.find(c => c.id === id);
  if (!course) {
    return res.status(404).json({ success: false, message: 'Course not found' });
  }

  // If code or name is changing, check for duplicates
  if (code && code.toUpperCase() !== course.code) {
    const duplicate = courses.find(c => c.code === code.toUpperCase() && c.id !== id);
    if (duplicate) {
      return res.status(400).json({ success: false, message: 'Course code already in use' });
    }
    course.code = code.toUpperCase();
  }

  if (course_name && course_name !== course.course_name) {
    const duplicate = courses.find(
      c => c.course_name.toLowerCase() === course_name.toLowerCase() && c.id !== id
    );
    if (duplicate) {
      return res.status(400).json({ success: false, message: 'Course name already in use' });
    }
    course.course_name = course_name;
  }

  if (description !== undefined) course.description = description;
  if (duration_months !== undefined) course.duration_months = Number(duration_months);
  if (is_active !== undefined) course.is_active = !!is_active;

  res.status(200).json({
    success: true,
    message: 'Course updated successfully',
    data: course
  });
};

// @desc    Toggle course active status (soft delete/reactivate)
// @route   DELETE /api/courses/:id
// @access  Private (Admin only)
const toggleCourseStatus = (req, res) => {
  const { id } = req.params;

  const course = courses.find(c => c.id === id);
  if (!course) {
    return res.status(404).json({ success: false, message: 'Course not found' });
  }

  course.is_active = !course.is_active;

  res.status(200).json({
    success: true,
    message: `Course ${course.is_active ? 'activated' : 'deactivated'} successfully`,
    data: course
  });
};

module.exports = {
  getCourses,
  createCourse,
  updateCourse,
  toggleCourseStatus
};
