const pool = require('../config/db');

// POST /api/subscribers
const subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email wajib diisi.' });
    }

    // Validasi format email sederhana
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Format email tidak valid.' });
    }

    // Cek sudah terdaftar
    const [existing] = await pool.query('SELECT id, is_active FROM subscribers WHERE email = ?', [email]);
    if (existing.length > 0) {
      if (existing[0].is_active) {
        return res.status(409).json({ success: false, message: 'Email sudah terdaftar sebagai subscriber.' });
      }
      // Re-activate
      await pool.query('UPDATE subscribers SET is_active = 1 WHERE id = ?', [existing[0].id]);
      return res.json({ success: true, message: 'Berhasil berlangganan kembali!' });
    }

    const [result] = await pool.query('INSERT INTO subscribers (email) VALUES (?)', [email]);

    res.status(201).json({
      success: true,
      message: 'Terima kasih! Anda berhasil berlangganan newsletter.',
      data: { id: result.insertId, email },
    });
  } catch (error) {
    console.error('Subscribe error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// GET /api/subscribers — admin only
const getAll = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM subscribers WHERE is_active = 1 ORDER BY subscribed_at DESC');
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Get subscribers error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// DELETE /api/subscribers/:id — unsubscribe
const unsubscribe = async (req, res) => {
  try {
    const [result] = await pool.query('UPDATE subscribers SET is_active = 0 WHERE id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Subscriber tidak ditemukan.' });
    }

    res.json({ success: true, message: 'Berhasil berhenti berlangganan.' });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { subscribe, getAll, unsubscribe };
