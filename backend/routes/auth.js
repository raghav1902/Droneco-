/**
 * @file auth.js
 * @description Routes for authentication.
 */

const express = require('express');
const router = express.Router();
const { loginUser, getMe, updateProfile } = require('../controllers/Auth/authController');
const { protect } = require('../middleware/authentication/authMiddleware');

router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

module.exports = router;
