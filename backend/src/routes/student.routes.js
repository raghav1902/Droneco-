const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student.controller');

// @route   POST /api/v2/students/admit/:lead_id
// @desc    Admit a Lead, creating a Student and Parent record
router.post('/admit/:lead_id', studentController.admitLead);

// @route   GET /api/v2/students
// @desc    Get all students
router.get('/', studentController.getStudents);

module.exports = router;
