/**
 * @file auth.js
 * @description Routes for authentication.
 */

const express = require('express');
const router = express.Router();
const { loginUser, getMe } = require('../controllers/Auth/authController');
const { protect } = require('../middleware/authentication/authMiddleware');

router.post('/login', loginUser);
router.get('/me', protect, getMe);

module.exports = router;
