// ─────────────────────────────────────────────────────────────────────────────
// middleware/isAdmin.js
// Must be used AFTER protect middleware (requires req.user).
// Blocks non-admin users with 403 Forbidden.
// ─────────────────────────────────────────────────────────────────────────────
'use strict';

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  return res.status(403).json({ success: false, message: 'Admin access required' });
};

module.exports = { isAdmin };
