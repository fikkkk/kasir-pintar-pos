const express = require('express');
const router = express.Router();
const { create, getAll, getById, getTodaySummary, getWeeklySummary } = require('../controllers/transactionController');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

// Semua endpoint transaksi perlu login
router.use(verifyToken);

// Summary — admin only
router.get('/summary/today', getTodaySummary);
router.get('/summary/weekly', authorizeRoles('admin'), getWeeklySummary);

// CRUD
router.post('/', create);
router.get('/', getAll);
router.get('/:id', getById);

module.exports = router;
