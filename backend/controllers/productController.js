const pool = require('../config/db');

// GET /api/products?search=&category=&page=&limit=
const getAll = async (req, res) => {
  try {
    const { search, category, page = 1, limit = 50 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let query = `
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = 1
    `;
    const params = [];

    if (search) {
      query += ' AND (p.name LIKE ? OR p.barcode LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (category && category !== 'all') {
      query += ' AND p.category_id = ?';
      params.push(parseInt(category));
    }

    // Count total
    const countQuery = query.replace('SELECT p.*, c.name as category_name', 'SELECT COUNT(*) as total');
    const [countResult] = await pool.query(countQuery, params);
    const total = countResult[0].total;

    // Fetch data
    query += ' ORDER BY p.name ASC LIMIT ? OFFSET ?';
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
    console.error('Get products error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// GET /api/products/:id
const getById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.*, c.name as category_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = ?`,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Produk tidak ditemukan.' });
    }

    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// GET /api/products/barcode/:barcode
const getByBarcode = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.*, c.name as category_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.barcode = ? AND p.is_active = 1`,
      [req.params.barcode]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Produk dengan barcode tersebut tidak ditemukan.' });
    }

    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Get product by barcode error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// POST /api/products
const create = async (req, res) => {
  try {
    const { barcode, name, category_id, buy_price, sell_price, stock, image_url } = req.body;

    if (!barcode || !name || !category_id || sell_price === undefined) {
      return res.status(400).json({ success: false, message: 'Barcode, nama, kategori, dan harga jual wajib diisi.' });
    }

    // Cek barcode unik
    const [existing] = await pool.query('SELECT id FROM products WHERE barcode = ?', [barcode]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'Barcode sudah digunakan produk lain.' });
    }

    const [result] = await pool.query(
      `INSERT INTO products (barcode, name, category_id, buy_price, sell_price, stock, image_url)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [barcode, name, category_id, buy_price || 0, sell_price, stock || 0, image_url || null]
    );

    res.status(201).json({
      success: true,
      message: 'Produk berhasil ditambahkan.',
      data: { id: result.insertId, barcode, name },
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// PUT /api/products/:id
const update = async (req, res) => {
  try {
    const { barcode, name, category_id, buy_price, sell_price, stock, image_url } = req.body;
    const { id } = req.params;

    if (!barcode || !name || !category_id || sell_price === undefined) {
      return res.status(400).json({ success: false, message: 'Barcode, nama, kategori, dan harga jual wajib diisi.' });
    }

    // Cek barcode unik (selain id ini)
    const [existing] = await pool.query('SELECT id FROM products WHERE barcode = ? AND id != ?', [barcode, id]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'Barcode sudah digunakan produk lain.' });
    }

    const [result] = await pool.query(
      `UPDATE products SET barcode = ?, name = ?, category_id = ?, buy_price = ?,
       sell_price = ?, stock = ?, image_url = ? WHERE id = ?`,
      [barcode, name, category_id, buy_price || 0, sell_price, stock || 0, image_url || null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Produk tidak ditemukan.' });
    }

    res.json({ success: true, message: 'Produk berhasil diperbarui.' });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// DELETE /api/products/:id (soft delete)
const remove = async (req, res) => {
  try {
    const [result] = await pool.query('UPDATE products SET is_active = 0 WHERE id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Produk tidak ditemukan.' });
    }

    res.json({ success: true, message: 'Produk berhasil dihapus.' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// GET /api/products/low-stock — produk stok menipis (< 10)
const getLowStock = async (req, res) => {
  try {
    const threshold = parseInt(req.query.threshold) || 10;
    const [rows] = await pool.query(
      `SELECT p.*, c.name as category_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.is_active = 1 AND p.stock < ?
       ORDER BY p.stock ASC`,
      [threshold]
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Get low stock error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { getAll, getById, getByBarcode, create, update, remove, getLowStock };
