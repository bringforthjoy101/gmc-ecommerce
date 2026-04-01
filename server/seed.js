// ─────────────────────────────────────────────────────────────────────────────
// seed.js — Populate DB with 1 admin user + 10 products
// Run: node seed.js
// ─────────────────────────────────────────────────────────────────────────────
'use strict';
require('dotenv').config({ path: './config/.env' });
const mongoose = require('mongoose');
const User     = require('./models/User');
const Product  = require('./models/Product');

const products = [
  { name: 'Wireless Noise-Cancelling Headphones', description: 'Premium over-ear headphones with 30h battery life and active noise cancellation.', price: 89.99,  category: 'Electronics', imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', stock: 42, rating: 4.7, numReviews: 312 },
  { name: 'Smart Watch Series 5',                 description: 'Track fitness, receive notifications, and monitor sleep with this sleek smartwatch.', price: 199.99, category: 'Electronics', imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', stock: 28, rating: 4.5, numReviews: 198 },
  { name: 'Portable Bluetooth Speaker',           description: 'Waterproof 360° sound speaker. Perfect for outdoor adventures.', price: 49.99,  category: 'Electronics', imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400', stock: 65, rating: 4.3, numReviews: 154 },
  { name: 'Men\'s Classic Fit T-Shirt',           description: '100% organic cotton. Available in 8 colours. Breathable and durable.', price: 19.99,  category: 'Clothing',     imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', stock: 150, rating: 4.2, numReviews: 87 },
  { name: 'Women\'s Running Shoes',               description: 'Lightweight mesh upper with responsive foam sole. Ideal for 5K to marathon.',  price: 74.99,  category: 'Sports',       imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', stock: 55,  rating: 4.6, numReviews: 241 },
  { name: 'The Pragmatic Programmer',             description: 'A classic software engineering book every developer should read. 20th anniversary edition.', price: 34.99,  category: 'Books', imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400', stock: 80, rating: 4.9, numReviews: 503 },
  { name: 'Clean Code by Robert C. Martin',       description: 'Learn how to write readable, maintainable code. Essential for professional developers.', price: 29.99,  category: 'Books', imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400', stock: 60, rating: 4.8, numReviews: 412 },
  { name: 'Non-Stick Ceramic Frying Pan',         description: '28cm PFOA-free ceramic pan. Oven-safe up to 400°F. Dishwasher safe.', price: 39.99,  category: 'Kitchen',      imageUrl: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400', stock: 90, rating: 4.4, numReviews: 176 },
  { name: 'Stainless Steel Water Bottle',         description: 'Double-wall vacuum insulated. Keeps drinks cold 24h, hot 12h. BPA-free.', price: 24.99,  category: 'Kitchen',      imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400', stock: 120, rating: 4.6, numReviews: 289 },
  { name: 'Yoga Mat Pro',                         description: 'Extra-thick 6mm non-slip mat with alignment lines. Includes carry strap.', price: 29.99,  category: 'Sports',       imageUrl: 'https://images.unsplash.com/photo-1601925228101-5e7d7a9cc7f5?w=400', stock: 75, rating: 4.5, numReviews: 133 },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  await User.deleteMany({});
  await Product.deleteMany({});

  // Admin user (password: admin123)
  await User.create({ name: 'Admin', email: 'admin@gmc.com', password: 'admin123', role: 'admin' });
  // Demo customer (password: customer123)
  await User.create({ name: 'Demo Customer', email: 'customer@gmc.com', password: 'customer123', role: 'customer' });

  await Product.insertMany(products);

  console.log('✅ Seeded: 2 users + 10 products');
  await mongoose.disconnect();
}

seed().catch((e) => { console.error(e); process.exit(1); });
