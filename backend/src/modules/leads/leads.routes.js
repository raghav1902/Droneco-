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
} = require('./lead.controller');
const { protect } = require('../../../middleware/authentication/authMiddleware');
const { validate } = require('../../../middleware/validationMiddleware');
const { createLeadSchema, updateLeadStatusSchema, addFeedbackSchema } = require('../../../validators/schemas');

// Public route for submitting inquiries (from QR multi-step form)
router.post('/', validate(createLeadSchema), createLead);

// Protected routes for staff
router.get('/', protect, getLeads);
router.patch('/:id/status', protect, validate(updateLeadStatusSchema), updateLeadStatus);
router.post('/:id/feedback', protect, validate(addFeedbackSchema), addLeadFeedback);
router.get('/:id/feedback', protect, getLeadFeedbackHistory);

module.exports = router;
