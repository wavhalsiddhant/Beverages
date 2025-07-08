const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Create a new product
router.post('/', productController.registerProduct);

// Get all products
router.get('/', productController.listProducts);

// Get a product by ID
router.get('/:id', productController.getProduct);

// Update a product
router.put('/:id', productController.updateProduct);

// Delete a product
router.delete('/:id', productController.deleteProduct);

module.exports = router;
