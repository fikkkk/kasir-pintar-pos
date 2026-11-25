const pool = require('../config/db');

// GET /api/categories
const getAll = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM categories ORDER BY name ASC');
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// GET /api/categories/:id
const getById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM categories WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Kategori tidak ditemukan.' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// POST /api/categories
const create = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Nama kategori wajib diisi.' });
    }

    const [existing] = await pool.query('SELECT id FROM categories WHERE name = ?', [name]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'Nama kategori sudah ada.' });
    }

    const [result] = await pool.query(
      'INSERT INTO categories (name, description) VALUES (?, ?)',
      [name, description || null]
    );

    res.status(201).json({
      success: true,
      message: 'Kategori berhasil ditambahkan.',
      data: { id: result.insertId, name, description },
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// PUT /api/categories/:id
const update = async (req, res) => {
  try {
    const { name, description } = req.body;
    const { id } = req.params;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Nama kategori wajib diisi.' });
    }

    // Cek duplikat nama (selain id ini)
    const [existing] = await pool.query('SELECT id FROM categories WHERE name = ? AND id != ?', [name, id]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'Nama kategori sudah ada.' });
    }

    const [result] = await pool.query(
      'UPDATE categories SET name = ?, description = ? WHERE id = ?',
      [name, description || null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Kategori tidak ditemukan.' });
    }

    res.json({ success: true, message: 'Kategori berhasil diperbarui.' });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// DELETE /api/categories/:id
const remove = async (req, res) => {
  try {
    // Cek apakah ada produk yang menggunakan kategori ini
    const [products] = await pool.query('SELECT id FROM products WHERE category_id = ? LIMIT 1', [req.params.id]);
    if (products.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Kategori tidak bisa dihapus karena masih ada produk yang menggunakannya.',
      });
    }

    const [result] = await pool.query('DELETE FROM categories WHERE id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Kategori tidak ditemukan.' });
    }

    res.json({ success: true, message: 'Kategori berhasil dihapus.' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { getAll, getById, create, update, remove };
