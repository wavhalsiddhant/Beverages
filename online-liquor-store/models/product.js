const pool = require('../config/db');

// Create a new product
const createProduct = async (productData) => {
    const { name, description, price, image_url, category } = productData;
    const query = 'INSERT INTO products (name, description, price, image_url, category) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const values = [name, description, price, image_url, category];

    const result = await pool.query(query, values);
    return result.rows[0];
};

// Get all products
const getAllProducts = async () => {
    const query = 'SELECT * FROM products';
    const result = await pool.query(query);
    return result.rows;
};

// Get a product by ID
const getProductById = async (id) => {
    const query = 'SELECT * FROM products WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

// Update a product
const updateProduct = async (id, productData) => {
    const { name, description, price, image_url, category } = productData;
    const query = 'UPDATE products SET name = $1, description = $2, price = $3, image_url = $4, category = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *';
    const values = [name, description, price, image_url, category, id];

    const result = await pool.query(query, values);
    return result.rows[0];
};

// Delete a product
const deleteProduct = async (id) => {
    const query = 'DELETE FROM products WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

// Function to get product by category
const getProductByCategory = async (category) => {
    const query = 'SELECT * FROM products WHERE category = $1'; // Adjust the table name and column as per your schema
    const values = [category];

    try {
        const result = await pool.query(query, values);
        return result.rows[0]; // Assuming you want to return the first matching product
    } catch (error) {
        throw new Error('Error fetching product by category: ' + error.message);
    }
};

module.exports = { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct, getProductByCategory };
