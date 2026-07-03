/**
 * @file admin.js
 * @description Routes for admin-specific endpoints (dashboard analytics).
 */

const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/Admin/statsController');
const { protect } = require('../middleware/authentication/authMiddleware');
const { authorize } = require('../middleware/authorization/roleMiddleware');

// Dashboard statistics (Admin only)
router.get('/stats', protect, authorize('admin'), getStats);

module.exports = router;
