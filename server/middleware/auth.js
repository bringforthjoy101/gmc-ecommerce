// ─────────────────────────────────────────────────────────────────────────────
// middleware/auth.js
// Verifies the JWT sent in Authorization: Bearer <token>
// Attaches the decoded payload to req.user for downstream handlers.
// ─────────────────────────────────────────────────────────────────────────────
'use strict';
const jwt  = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Not authenticated — no token' });
  }

  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Fetch fresh user (confirms account still exists and gets current role)
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ success: false, message: 'User no longer exists' });
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

module.exports = { protect };
