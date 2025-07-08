const orderModel = require('../models/order');

const placeOrder = async (req, res) => {
    const { user_id, items, total_amount } = req.body;

    try {
        const newOrder = await orderModel.createOrder({ user_id, total_amount });
        await orderModel.createOrderItems(newOrder.id, items);
        res.status(201).json({ message: 'Order placed successfully', order: newOrder });
    } catch (error) {
        res.status(500).json({ message: 'Error placing order', error });
    }
};

const getOrder = async (req, res) => {
    const { id } = req.params;

    try {
        const order = await orderModel.getOrderById(id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving order', error });
    }
};

const listUserOrders = async (req, res) => {
    const userId = req.session.user.id; // Get the user ID from the session

    try {
        const orders = await orderModel.getUserOrders(userId);
        return orders; // Return orders
    } catch (error) {
        throw new Error('Error retrieving orders', error);
    }
};

const updateOrder = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const updatedOrder = await orderModel.updateOrderStatus(id, status);
        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json({ message: 'Order updated successfully', order: updatedOrder });
    } catch (error) {
        res.status(500).json({ message: 'Error updating order', error });
    }
};

const deleteOrder = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedOrder = await orderModel.deleteOrder(id);
        if (!deletedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting order', error });
    }
};

module.exports = { placeOrder, getOrder, listUserOrders, updateOrder, deleteOrder };
