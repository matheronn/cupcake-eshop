const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/search', productController.catalog); 
router.get('/catalog', productController.catalog);

router.get('/', productController.catalog);
router.get('/:id', productController.details);

module.exports = router;