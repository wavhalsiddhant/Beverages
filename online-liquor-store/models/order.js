const pool = require('../config/db');

// Create a new order
const createOrder = async (orderData) => {
    const { user_id, total_amount } = orderData;
    const query = 'INSERT INTO orders (user_id, total_amount) VALUES ($1, $2) RETURNING *';
    const values = [user_id, total_amount];

    const result = await pool.query(query, values);
    return result.rows[0];
};

// Create order items
const createOrderItems = async (orderId, items) => {
    const query = 'INSERT INTO order_items (order_id, product_id, quantity, price, total) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const promises = items.map(item => {
        const { product_id, quantity, price } = item;
        const total = price * quantity;
        return pool.query(query, [orderId, product_id, quantity, price, total]);
    });
    const results = await Promise.all(promises);
    return results.map(result => result.rows[0]);
};

// Get order by ID
const getOrderById = async (id) => {
    const query = 'SELECT * FROM orders WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

// Get all orders for a user
const getUserOrders = async (userId) => {
    const query = 'SELECT * FROM orders WHERE user_id = $1';
    const result = await pool.query(query, [userId]);
    return result.rows;
};

// Update order status
const updateOrderStatus = async (id, status) => {
    const query = 'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *';
    const values = [status, id];

    const result = await pool.query(query, values);
    return result.rows[0];
};

// Delete an order
const deleteOrder = async (id) => {
    const query = 'DELETE FROM orders WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

module.exports = { createOrder, createOrderItems, getOrderById, getUserOrders, updateOrderStatus, deleteOrder };
