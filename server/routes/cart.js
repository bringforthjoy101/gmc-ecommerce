'use strict';
const express = require('express');
const router  = express.Router();
const { getCart, addToCart, updateCartItem, removeCartItem, clearCart } = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

router.use(protect);   // all cart routes require auth

router.get('/',           getCart);
router.post('/',          addToCart);
router.delete('/clear',   clearCart);
router.put('/:itemId',    updateCartItem);
router.delete('/:itemId', removeCartItem);

module.exports = router;
