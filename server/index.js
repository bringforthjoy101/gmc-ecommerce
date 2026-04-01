// ─────────────────────────────────────────────────────────────────────────────
// server/index.js — Express entry point
// ─────────────────────────────────────────────────────────────────────────────
'use strict';
require('dotenv').config({ path: require('path').join(__dirname, 'config/.env') });

const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const path     = require('path');

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(express.json());
app.use(cors({ origin: '*' }));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart',     require('./routes/cart'));
app.use('/api/orders',   require('./routes/orders'));

// Health check
app.get('/api/health', (_, res) => res.json({ status: 'ok', timestamp: new Date() }));

// ── Serve React build ─────────────────────────────────────────────────────────
const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));
app.get(/.*/, (_, res) => res.sendFile(path.join(publicDir, 'index.html')));

// ── Database + server start ───────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅  MongoDB connected');
    app.listen(PORT, () => console.log(`🚀  Server on http://localhost:${PORT}`));
  })
  .catch((err) => { console.error('MongoDB error:', err.message); process.exit(1); });
