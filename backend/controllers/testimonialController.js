const pool = require('../config/db');

// GET /api/testimonials
const getAll = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM testimonials WHERE is_active = 1 ORDER BY created_at DESC'
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Get testimonials error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// POST /api/testimonials — admin only
const create = async (req, res) => {
  try {
    const { customer_name, role_title, avatar_url, message, rating } = req.body;

    if (!customer_name || !message) {
      return res.status(400).json({ success: false, message: 'Nama dan pesan wajib diisi.' });
    }

    const [result] = await pool.query(
      'INSERT INTO testimonials (customer_name, role_title, avatar_url, message, rating) VALUES (?, ?, ?, ?, ?)',
      [customer_name, role_title || 'Pelanggan', avatar_url || null, message, rating || 5]
    );

    res.status(201).json({
      success: true,
      message: 'Testimoni berhasil ditambahkan.',
      data: { id: result.insertId },
    });
  } catch (error) {
    console.error('Create testimonial error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// DELETE /api/testimonials/:id — admin only
const remove = async (req, res) => {
  try {
    const [result] = await pool.query('UPDATE testimonials SET is_active = 0 WHERE id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Testimoni tidak ditemukan.' });
    }

    res.json({ success: true, message: 'Testimoni berhasil dihapus.' });
  } catch (error) {
    console.error('Delete testimonial error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { getAll, create, remove };
