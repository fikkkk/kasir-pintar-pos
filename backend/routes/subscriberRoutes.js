const express = require('express');
const router = express.Router();
const { subscribe, getAll, unsubscribe } = require('../controllers/subscriberController');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

// Public
router.post('/', subscribe);

// Admin only
router.get('/', verifyToken, authorizeRoles('admin'), getAll);
router.delete('/:id', verifyToken, authorizeRoles('admin'), unsubscribe);

module.exports = router;
