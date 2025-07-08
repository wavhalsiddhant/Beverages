const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Place a new order
router.post('/', orderController.placeOrder);

// Get an order by ID
router.get('/:id', orderController.getOrder);

// Get all orders for a user
router.get('/user/:user_id', orderController.listUserOrders);

// Update an order status
router.put('/:id', orderController.updateOrder);

// Delete an order
router.delete('/:id', orderController.deleteOrder);

router.get('/myOrders', async (req, res) => {
    // Your logic to fetch orders and render the view
    try {
        const orders = await getOrdersForUser(req.user.id); // Example function
        res.render('myorders', { orders, user: req.user });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

module.exports = router;
