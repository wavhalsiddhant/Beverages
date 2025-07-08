const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

// Middleware to check authentication
const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login'); // Redirect to login if not authenticated
};

// User registration
router.post('/', userController.register); // POST /api/users for user registration
router.post('/login', userController.login); // POST /api/users/login for user login

// Logout route
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Server Error');
        }

        // Flash message for logout confirmation
        // req.flash('message', 'You have logged out successfully.');
        res.redirect('/'); // Redirect to the login page after logout
    });
});

// GET user profile
router.get('/profile', ensureAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.session.user._id); // Adjust based on your User model
        res.render('profile', { user }); // Render the profile view
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

module.exports = router;
