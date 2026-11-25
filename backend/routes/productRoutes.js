const express = require('express');
const router = express.Router();
const { getAll, getById, getByBarcode, create, update, remove, getLowStock } = require('../controllers/productController');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

// Public — daftar produk untuk halaman POS & katalog
router.get('/', getAll);
router.get('/low-stock', verifyToken, getLowStock);
router.get('/barcode/:barcode', getByBarcode);
router.get('/:id', getById);

// Admin only
router.post('/', verifyToken, authorizeRoles('admin'), create);
router.put('/:id', verifyToken, authorizeRoles('admin'), update);
router.delete('/:id', verifyToken, authorizeRoles('admin'), remove);

module.exports = router;
