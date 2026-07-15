const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student.controller');

const { protect } = require('../middleware/authentication/authMiddleware');
const { authorize } = require('../middleware/authorization/roleMiddleware');

// @route   POST /api/v2/students/admit/:lead_id
// @desc    Admit a Lead, creating a Student and Parent record
router.post('/admit/:lead_id', protect, authorize('Admin', 'Receptionist'), studentController.admitLead);

// @route   GET /api/v2/students/next-id
// @desc    Preview the next available student ID and admission number
router.get('/next-id', protect, authorize('Admin', 'Receptionist'), studentController.getNextId);

// @route   GET /api/v2/students
// @desc    Get all students
router.get('/', protect, authorize('Admin', 'Receptionist'), studentController.getStudents);

// @route   GET /api/v2/students/:id
// @desc    Get a student by ID
router.get('/:id', protect, authorize('Admin', 'Receptionist'), studentController.getStudentById);

// @route   PUT /api/v2/students/:id
// @desc    Update a student
router.put('/:id', protect, authorize('Admin', 'Receptionist'), studentController.updateStudent);

module.exports = router;
