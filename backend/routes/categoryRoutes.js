const express = require('express');
const router = express.Router();
const { getAll, getById, create, update, remove } = require('../controllers/categoryController');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

// Public — daftar kategori untuk filter di halaman POS
router.get('/', getAll);
router.get('/:id', getById);

// Admin only
router.post('/', verifyToken, authorizeRoles('admin'), create);
router.put('/:id', verifyToken, authorizeRoles('admin'), update);
router.delete('/:id', verifyToken, authorizeRoles('admin'), remove);

module.exports = router;
