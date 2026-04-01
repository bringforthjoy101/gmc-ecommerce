// ─────────────────────────────────────────────────────────────────────────────
// models/Product.js
// Represents a single item in the store catalog.
// ─────────────────────────────────────────────────────────────────────────────
'use strict';
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price:       { type: Number, required: true, min: 0 },
  category:    {
    type: String, required: true,
    enum: ['Electronics', 'Clothing', 'Books', 'Kitchen', 'Sports', 'Other'],
  },
  imageUrl:    { type: String, default: '' },
  stock:       { type: Number, required: true, min: 0, default: 0 },
  rating:      { type: Number, default: 0, min: 0, max: 5 },
  numReviews:  { type: Number, default: 0 },
}, { timestamps: true });

// Text index — enables $text search on name and description
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
