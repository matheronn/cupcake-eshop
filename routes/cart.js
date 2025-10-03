const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { isAuthenticated } = require('../middleware/auth');

router.use(isAuthenticated);

router.get('/', cartController.viewCart);

router.post('/add', cartController.addToCart);

router.post('/update', cartController.updateQuantity);

router.post('/remove/:itemId', cartController.removeItem);

router.post('/clear', cartController.clearCart);

module.exports = router;