const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { isAuthenticated } = require('../middleware/auth');

router.use(isAuthenticated);

router.get('/checkout', orderController.checkout);
router.post('/checkout', orderController.processOrder);

router.get('/:id/success', orderController.orderSuccess);

router.get('/', orderController.myOrders);

router.get('/:id', orderController.orderDetails);

module.exports = router;