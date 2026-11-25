const express = require('express');
const router = express.Router();
const { login, getMe, register, getAllUsers } = require('../controllers/authController');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

// Public
router.post('/login', login);

// Protected
router.get('/me', verifyToken, getMe);

// Admin only
router.post('/register', verifyToken, authorizeRoles('admin'), register);
router.get('/users', verifyToken, authorizeRoles('admin'), getAllUsers);

module.exports = router;
