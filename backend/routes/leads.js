/**
 * @file leads.js
 * @description Routes for managing student inquiries.
 */

const express = require('express');
const router = express.Router();
const {
  createLead,
  getLeads,
  updateLeadStatus,
  addLeadFeedback,
  getLeadFeedbackHistory
} = require('../controllers/Lead/leadController');
const { protect } = require('../middleware/authentication/authMiddleware');

// Public route for submitting inquiries (from QR multi-step form)
router.post('/', createLead);

// Protected routes for staff
router.get('/', protect, getLeads);
router.patch('/:id/status', protect, updateLeadStatus);
router.post('/:id/feedback', protect, addLeadFeedback);
router.get('/:id/feedback', protect, getLeadFeedbackHistory);

module.exports = router;
