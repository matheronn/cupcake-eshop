const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const multer = require('multer');

const upload = multer();

router.use(isAuthenticated, isAdmin);

router.get('/', adminController.dashboard);

router.get('/products', adminController.listProducts);
router.get('/products/new', adminController.showNewProduct);
router.post('/products/new', upload.none(), adminController.createProduct);
router.get('/products/edit/:id', adminController.showEditProduct);
router.post('/products/edit/:id', upload.none(), adminController.updateProduct);
router.post('/products/delete/:id', adminController.deleteProduct);

router.get('/orders', adminController.listOrders);
router.post('/orders/:id/status', adminController.updateOrderStatus);

module.exports = router;