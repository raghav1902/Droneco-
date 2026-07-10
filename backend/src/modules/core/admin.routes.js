/**
 * @file admin.js
 * @description Routes for admin-specific endpoints (dashboard analytics).
 */

const express = require('express');
const router = express.Router();
const { getStats } = require('./stats.controller');
const { getReports } = require('./reports.controller');
const { protect } = require('../../../middleware/authentication/authMiddleware');
const { authorize } = require('../../../middleware/authorization/roleMiddleware');

// Dashboard statistics (Admin only)
router.get('/stats', protect, authorize('admin'), getStats);

// Reports (Admin only)
router.get('/reports', protect, authorize('admin'), getReports);

module.exports = router;
