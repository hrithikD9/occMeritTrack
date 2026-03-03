const express = require('express');
const router = express.Router();
const { login, verifyToken } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// @route   POST /api/auth/login
router.post('/login', login);

// @route   GET /api/auth/verify
router.get('/verify', protect, verifyToken);

module.exports = router;
