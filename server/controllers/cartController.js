// ─────────────────────────────────────────────────────────────────────────────
// controllers/cartController.js
// One cart per user. Adds, updates quantity, and removes items.
// ─────────────────────────────────────────────────────────────────────────────
'use strict';
const Cart    = require('../models/Cart');
const Product = require('../models/Product');

// GET /api/cart
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart) return res.status(200).json({ success: true, data: { items: [] } });
    res.status(200).json({ success: true, data: cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/cart  { productId, quantity }
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Validate product exists and has enough stock
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    if (product.stock < quantity)
      return res.status(400).json({ success: false, message: 'Insufficient stock' });

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = new Cart({ user: req.user._id, items: [] });

    const existing = cart.items.find((i) => i.product.toString() === productId);
    if (existing) {
      existing.quantity += Number(quantity);
    } else {
      cart.items.push({ product: productId, quantity: Number(quantity) });
    }

    await cart.save();
    await cart.populate('items.product');
    res.status(200).json({ success: true, data: cart });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT /api/cart/:itemId  { quantity }
const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    const item = cart.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found in cart' });

    if (Number(quantity) <= 0) {
      item.deleteOne();
    } else {
      item.quantity = Number(quantity);
    }

    await cart.save();
    await cart.populate('items.product');
    res.status(200).json({ success: true, data: cart });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE /api/cart/:itemId
const removeCartItem = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    const item = cart.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });

    item.deleteOne();
    await cart.save();
    await cart.populate('items.product');
    res.status(200).json({ success: true, data: cart });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE /api/cart  (clear entire cart — used after order placement)
const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user._id });
    res.status(200).json({ success: true, message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeCartItem, clearCart };
