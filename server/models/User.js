// ─────────────────────────────────────────────────────────────────────────────
// models/User.js
// Stores registered users. Passwords are hashed with bcrypt before saving.
// Role field controls access: 'customer' (default) or 'admin'.
// ─────────────────────────────────────────────────────────────────────────────
'use strict';
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String, required: [true, 'Name is required'], trim: true,
  },
  email: {
    type: String, required: [true, 'Email is required'],
    unique: true, lowercase: true, trim: true,
  },
  password: {
    type: String, required: [true, 'Password is required'], minlength: 6,
    select: false,   // never returned in queries unless explicitly requested
  },
  role: {
    type: String, enum: ['customer', 'admin'], default: 'customer',
  },
}, { timestamps: true });

// Hash password before saving (only when modified)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Instance method: compare plain-text password with stored hash
userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

module.exports = mongoose.model('User', userSchema);
