// ─────────────────────────────────────────────────────────────────────────────
// controllers/orderController.js
// Place orders, view order history, admin: view all orders + update status.
// ─────────────────────────────────────────────────────────────────────────────
'use strict';
const Order   = require('../models/Order');
const Cart    = require('../models/Cart');
const Product = require('../models/Product');

const SHIPPING_THRESHOLD = 100;   // free shipping above this price
const SHIPPING_FEE       = 10;

// POST /api/orders  — place order from current cart
const placeOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod = 'Credit Card' } = req.body;
    if (!shippingAddress)
      return res.status(400).json({ success: false, message: 'Shipping address required' });

    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0)
      return res.status(400).json({ success: false, message: 'Cart is empty' });

    // Build snapshot items and calculate totals
    const items = cart.items.map((i) => ({
      product:  i.product._id,
      name:     i.product.name,
      imageUrl: i.product.imageUrl,
      price:    i.product.price,
      quantity: i.quantity,
    }));

    const itemsPrice   = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const shippingPrice = itemsPrice >= SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    const totalPrice   = +(itemsPrice + shippingPrice).toFixed(2);

    // Decrease stock for each product
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity },
      });
    }

    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod,
      itemsPrice: +itemsPrice.toFixed(2),
      shippingPrice,
      totalPrice,
      paidAt: new Date(),   // assume immediate payment for simplicity
    });

    // Clear the cart after successful order
    await Cart.findOneAndDelete({ user: req.user._id });

    res.status(201).json({ success: true, data: order });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// GET /api/orders/mine  — logged-in user's own orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/orders/:id  — single order (owner or admin)
const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    const isOwner = order.user._id.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Not authorised' });

    res.status(200).json({ success: true, data: order });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// GET /api/orders  (admin) — all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/orders/:id/status  (admin) — update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, ...(status === 'delivered' ? { deliveredAt: new Date() } : {}) },
      { new: true, runValidators: true }
    );
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.status(200).json({ success: true, data: order });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

module.exports = { placeOrder, getMyOrders, getOrder, getAllOrders, updateOrderStatus };
