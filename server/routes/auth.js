const express = require('express');
const router = express.Router();

const { register, login, logout, getMe } = require('../controllers/authController');
const { authLimiter } = require('../middleware/rateLimiter');
const { validateRegister, validateLogin, runValidation } = require('../middleware/validate');
const { protect } = require('../middleware/auth');

// POST /api/auth/register - Register a new user
router.post('/register', validateRegister, runValidation, register);

// POST /api/auth/login - Login user (rate limited)
router.post('/login', authLimiter, validateLogin, runValidation, login);

// POST /api/auth/logout - Logout user
router.post('/logout', logout);

// GET /api/auth/me - Get current user profile (protected)
router.get('/me', protect, getMe);

module.exports = router;
