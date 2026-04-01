// ─────────────────────────────────────────────────────────────────────────────
// models/Order.js
// Snapshot of a placed order. Product details are embedded (not referenced)
// so historical orders remain accurate even if a product is later edited.
// ─────────────────────────────────────────────────────────────────────────────
'use strict';
const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name:     String,
  imageUrl: String,
  price:    Number,
  quantity: Number,
}, { _id: false });

const shippingSchema = new mongoose.Schema({
  address: { type: String, required: true },
  city:    { type: String, required: true },
  country: { type: String, required: true },
  zip:     { type: String, required: true },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user:            { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items:           [orderItemSchema],
  shippingAddress: { type: shippingSchema, required: true },
  paymentMethod:   { type: String, default: 'Credit Card' },
  itemsPrice:      { type: Number, required: true },
  shippingPrice:   { type: Number, default: 0 },
  totalPrice:      { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  paidAt:          Date,
  deliveredAt:     Date,
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
