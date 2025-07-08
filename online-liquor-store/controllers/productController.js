const productModel = require('../models/product');

// Register a new product
const registerProduct = async (req, res) => {
    const { name, description, price, image_url, category } = req.body;

    try {
        const newProduct = await productModel.createProduct({ name, description, price, image_url, category });
        res.status(201).json({ message: 'Product created successfully', product: newProduct });
    } catch (error) {
        res.status(500).json({ message: 'Error creating product', error });
    }
};

// Get all products
const listProducts = async (req, res) => {
    try {
        const products = await productModel.getAllProducts();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving products', error });
    }
};

// Get product by ID
const getProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await productModel.getProductById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving product', error });
    }
};

// Update a product
const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, description, price, image_url, category } = req.body;

    try {
        const updatedProduct = await productModel.updateProduct(id, { name, description, price, image_url, category });
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
        res.status(500).json({ message: 'Error updating product', error });
    }
};

// Delete a product
const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedProduct = await productModel.deleteProduct(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error });
    }
};

const getProductByCategory = async (category) => {
    try {
        const result = await db.query('SELECT * FROM products WHERE category = $1', [category]);
        return result.rows[0]; // Return the first product found
    } catch (error) {
        throw new Error('Database query failed');
    }
};

module.exports = { registerProduct, listProducts, getProduct, updateProduct, deleteProduct, getProductByCategory };
