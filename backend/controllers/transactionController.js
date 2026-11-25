const pool = require('../config/db');

// POST /api/transactions — buat transaksi baru
const create = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { items, paid_amount, notes } = req.body;

    // Validasi
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Keranjang belanja kosong.' });
    }

    if (!paid_amount || paid_amount <= 0) {
      return res.status(400).json({ success: false, message: 'Jumlah bayar wajib diisi.' });
    }

    await connection.beginTransaction();

    // Hitung total dan validasi stok
    let totalAmount = 0;
    const validatedItems = [];

    for (const item of items) {
      const [products] = await connection.query(
        'SELECT id, barcode, name, sell_price, stock FROM products WHERE id = ? AND is_active = 1 FOR UPDATE',
        [item.product_id]
      );

      if (products.length === 0) {
        await connection.rollback();
        return res.status(404).json({
          success: false,
          message: `Produk dengan ID ${item.product_id} tidak ditemukan.`,
        });
      }

      const product = products[0];

      if (product.stock < item.quantity) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: `Stok "${product.name}" tidak mencukupi. Tersedia: ${product.stock}, diminta: ${item.quantity}.`,
        });
      }

      const subtotal = product.sell_price * item.quantity;
      totalAmount += subtotal;

      validatedItems.push({
        product_id: product.id,
        product_name: product.name,
        product_barcode: product.barcode,
        quantity: item.quantity,
        unit_price: product.sell_price,
        subtotal,
      });
    }

    if (paid_amount < totalAmount) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: `Uang bayar (Rp ${paid_amount.toLocaleString()}) kurang dari total (Rp ${totalAmount.toLocaleString()}).`,
      });
    }

    const changeAmount = paid_amount - totalAmount;

    // Generate nomor invoice: INV-YYYYMMDD-XXX
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');

    const [lastInvoice] = await connection.query(
      "SELECT invoice_number FROM transactions WHERE invoice_number LIKE ? ORDER BY id DESC LIMIT 1",
      [`INV-${dateStr}-%`]
    );

    let seq = 1;
    if (lastInvoice.length > 0) {
      const lastSeq = parseInt(lastInvoice[0].invoice_number.split('-')[2]);
      seq = lastSeq + 1;
    }

    const invoiceNumber = `INV-${dateStr}-${String(seq).padStart(3, '0')}`;

    // Insert header transaksi
    const [txResult] = await connection.query(
      `INSERT INTO transactions (invoice_number, user_id, total_amount, paid_amount, change_amount, transaction_date, notes)
       VALUES (?, ?, ?, ?, ?, NOW(), ?)`,
      [invoiceNumber, req.user.id, totalAmount, paid_amount, changeAmount, notes || null]
    );

    const transactionId = txResult.insertId;

    // Insert detail items
    for (const item of validatedItems) {
      await connection.query(
        `INSERT INTO transaction_details (transaction_id, product_id, product_name, product_barcode, quantity, unit_price, subtotal)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [transactionId, item.product_id, item.product_name, item.product_barcode, item.quantity, item.unit_price, item.subtotal]
      );

      // Kurangi stok
      await connection.query('UPDATE products SET stock = stock - ? WHERE id = ?', [item.quantity, item.product_id]);
    }

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Transaksi berhasil!',
      data: {
        id: transactionId,
        invoice_number: invoiceNumber,
        total_amount: totalAmount,
        paid_amount,
        change_amount: changeAmount,
        items: validatedItems,
        transaction_date: now,
        cashier: req.user.full_name,
      },
    });
  } catch (error) {
    await connection.rollback();
    console.error('Create transaction error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  } finally {
    connection.release();
  }
};

// GET /api/transactions?date=&start_date=&end_date=&page=&limit=
const getAll = async (req, res) => {
  try {
    const { date, start_date, end_date, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let query = `
      SELECT t.*, u.full_name as cashier_name
      FROM transactions t
      LEFT JOIN users u ON t.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    // Filter kasir: hanya lihat transaksi hari ini
    if (req.user.role === 'kasir') {
      query += ' AND DATE(t.transaction_date) = CURDATE()';
    }

    if (date) {
      query += ' AND DATE(t.transaction_date) = ?';
      params.push(date);
    } else if (start_date && end_date) {
      query += ' AND DATE(t.transaction_date) BETWEEN ? AND ?';
      params.push(start_date, end_date);
    }

    // Count
    const countQuery = query.replace('SELECT t.*, u.full_name as cashier_name', 'SELECT COUNT(*) as total');
    const [countResult] = await pool.query(countQuery, params);
    const total = countResult[0].total;

    // Fetch
    query += ' ORDER BY t.transaction_date DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [rows] = await pool.query(query, params);

    res.json({
      success: true,
      data: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// GET /api/transactions/:id — detail transaksi dengan items
const getById = async (req, res) => {
  try {
    const [txRows] = await pool.query(
      `SELECT t.*, u.full_name as cashier_name
       FROM transactions t
       LEFT JOIN users u ON t.user_id = u.id
       WHERE t.id = ?`,
      [req.params.id]
    );

    if (txRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Transaksi tidak ditemukan.' });
    }

    const [items] = await pool.query(
      'SELECT * FROM transaction_details WHERE transaction_id = ?',
      [req.params.id]
    );

    res.json({
      success: true,
      data: {
        ...txRows[0],
        items,
      },
    });
  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// GET /api/transactions/summary/today — ringkasan hari ini
const getTodaySummary = async (req, res) => {
  try {
    const [summary] = await pool.query(`
      SELECT
        COALESCE(SUM(total_amount), 0) as total_revenue,
        COUNT(*) as total_transactions,
        COALESCE(AVG(total_amount), 0) as avg_transaction
      FROM transactions
      WHERE DATE(transaction_date) = CURDATE()
    `);

    const [productCount] = await pool.query(
      'SELECT COUNT(*) as total FROM products WHERE is_active = 1'
    );

    const [lowStock] = await pool.query(
      'SELECT COUNT(*) as total FROM products WHERE is_active = 1 AND stock < 10'
    );

    res.json({
      success: true,
      data: {
        total_revenue: summary[0].total_revenue,
        total_transactions: summary[0].total_transactions,
        avg_transaction: summary[0].avg_transaction,
        total_products: productCount[0].total,
        low_stock_count: lowStock[0].total,
      },
    });
  } catch (error) {
    console.error('Get today summary error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// GET /api/transactions/summary/weekly — ringkasan 7 hari terakhir
const getWeeklySummary = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        DATE(transaction_date) as date,
        COALESCE(SUM(total_amount), 0) as revenue,
        COUNT(*) as transactions
      FROM transactions
      WHERE transaction_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      GROUP BY DATE(transaction_date)
      ORDER BY date ASC
    `);

    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Get weekly summary error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { create, getAll, getById, getTodaySummary, getWeeklySummary };
