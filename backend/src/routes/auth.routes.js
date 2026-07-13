/**
 * @file auth.js
 * @description Routes for authentication.
 */

const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, updateProfile, changePassword } = require('../controllers/auth.controller');
const { protect } = require('../middleware/authentication/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const { authLoginSchema, changePasswordSchema, createUserSchema } = require('../validators/schemas');

router.post('/register', validate(createUserSchema), registerUser); 
router.post('/login', validate(authLoginSchema), loginUser);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, validate(changePasswordSchema), changePassword);

module.exports = router;
