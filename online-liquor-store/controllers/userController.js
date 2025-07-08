const User = require('../models/user');

const userController = {
    async register(req, res) {
        const { name, username, email, password, address, aadhaar_id } = req.body;
        // Error handling in register function
try {
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
        return res.status(400).json({ error: 'Email already exists' });
    }
    const newUser = await User.create({ name, username, email, password, address, aadhaar_id });
    res.status(201).json(newUser);
} catch (error) {
    console.error('Error registering user:', error.message); // Log the specific error message
    res.status(500).json({ error: 'An error occurred while registering. Please try again.' });
}

    },

    async login(req, res) {
        const { email, password } = req.body;
        try {
            const user = await User.findByEmail(email);
            if (!user || !(await User.verifyPassword(user, password))) {
                return res.status(401).json({ error: 'Invalid email or password' }); // Unauthorized
            }
            // User authenticated successfully, store user info in session
            // User authenticated successfully, store user info in session
            req.session.user = { id: user.id, name: user.name, email: user.email, username: user.username, aadhaar_id: user.aadhaar_id, address: user.address }; // Store relevant user info
            res.status(200).json({ message: 'Login successful', user: req.session.user });
        } catch (error) {
            console.error('Error logging in:', error);
            res.status(500).send('Server error');
        }
    },

    // Add a new method to fetch user profile
    async getProfile(req, res) {
        const userId = req.session.user.id; // Use the user ID from the session
        try {
            const user = await User.findById(userId); // Fetch user details from the User model
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.status(200).json(user); // Respond with user details
        } catch (error) {
            console.error('Error fetching user profile:', error);
            res.status(500).send('Server error');
        }
    }
    
};

module.exports = userController;
