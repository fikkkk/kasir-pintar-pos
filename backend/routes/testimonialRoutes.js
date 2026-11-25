const express = require('express');
const router = express.Router();
const { getAll, create, remove } = require('../controllers/testimonialController');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

// Public
router.get('/', getAll);

// Admin only
router.post('/', verifyToken, authorizeRoles('admin'), create);
router.delete('/:id', verifyToken, authorizeRoles('admin'), remove);

module.exports = router;
