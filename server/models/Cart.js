// ─────────────────────────────────────────────────────────────────────────────
// models/Cart.js
// One cart per user. Items embed product reference + quantity.
// ─────────────────────────────────────────────────────────────────────────────
'use strict';
const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1, default: 1 },
}, { _id: true });

const cartSchema = new mongoose.Schema({
  user:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [cartItemSchema],
}, { timestamps: true });

// Virtual: total item count
cartSchema.virtual('totalItems').get(function () {
  return this.items.reduce((sum, i) => sum + i.quantity, 0);
});

module.exports = mongoose.model('Cart', cartSchema);
