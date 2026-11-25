const jwt = require('jsonwebtoken');

// Middleware: Verifikasi JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ success: false, message: 'Token tidak ditemukan. Silakan login.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, username, role }
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: 'Token tidak valid atau sudah kadaluarsa.' });
  }
};

// Middleware: Hanya role tertentu yang boleh akses
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Akses ditolak. Hanya role [${roles.join(', ')}] yang diizinkan.`,
      });
    }
    next();
  };
};

module.exports = { verifyToken, authorizeRoles };
