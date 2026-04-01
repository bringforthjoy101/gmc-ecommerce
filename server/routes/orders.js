'use strict';
const express = require('express');
const router  = express.Router();
const { placeOrder, getMyOrders, getOrder, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const { isAdmin } = require('../middleware/isAdmin');

router.use(protect);

router.post('/',                    placeOrder);
router.get('/mine',                 getMyOrders);
router.get('/',                     isAdmin, getAllOrders);
router.get('/:id',                  getOrder);
router.put('/:id/status',           isAdmin, updateOrderStatus);

module.exports = router;
