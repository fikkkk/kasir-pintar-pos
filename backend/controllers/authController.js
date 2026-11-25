const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username dan password wajib diisi.' });
    }

    const [rows] = await pool.query('SELECT * FROM users WHERE username = ? AND is_active = 1', [username]);

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Username atau password salah.' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Username atau password salah.' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role, full_name: user.full_name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    res.json({
      success: true,
      message: 'Login berhasil!',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          full_name: user.full_name,
          role: user.role,
          avatar_url: user.avatar_url,
        },
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// GET /api/auth/me — ambil profil user dari token
const getMe = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, username, full_name, role, avatar_url, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan.' });
    }

    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// POST /api/auth/register — admin only
const register = async (req, res) => {
  try {
    const { username, password, full_name, role } = req.body;

    if (!username || !password || !full_name) {
      return res.status(400).json({ success: false, message: 'Semua field wajib diisi.' });
    }

    // Cek username sudah ada
    const [existing] = await pool.query('SELECT id FROM users WHERE username = ?', [username]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'Username sudah digunakan.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [result] = await pool.query(
      'INSERT INTO users (username, password, full_name, role) VALUES (?, ?, ?, ?)',
      [username, hashedPassword, full_name, role || 'kasir']
    );

    res.status(201).json({
      success: true,
      message: 'User berhasil didaftarkan.',
      data: { id: result.insertId, username, full_name, role: role || 'kasir' },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// GET /api/auth/users — admin only, daftar semua user
const getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, username, full_name, role, is_active, avatar_url, created_at FROM users ORDER BY created_at DESC'
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('GetAllUsers error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { login, getMe, register, getAllUsers };
