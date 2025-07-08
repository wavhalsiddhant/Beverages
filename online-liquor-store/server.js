const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash'); // Import connect-flash
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes'); // Add this line for order routes
const productModel = require('./models/product');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Setup session middleware
app.use(session({
    secret: 'your_secret_key', // Replace with an environment variable for security
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true when using HTTPS
}));

app.use(flash()); // Initialize connect-flash after session middleware

app.use(express.static(path.join(__dirname, 'public')));

// Define API routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes); // Register order routes

app.get('/', (req, res) => {
    const user = req.session.user || null;
    res.render('index', { user });
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.get('/login', (req, res) => {
    const messages = req.flash('message'); // Get flash messages
    res.render('login', { messages });
});

app.get('/details', (req, res) => {
    const user = req.session.user || null;
    res.render('details', { user });
});

app.get('/buyNow', async (req, res) => {
    try {
        const products = await productModel.getAllProducts();
        res.render('buyNow', { products, user: req.session.user || null });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Server Error');
    }
});

// Updated checkout route
app.get('/checkout', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login'); // Redirect to login if not logged in
    }

    const productType = req.query.type;

    try {
        // Fetch product details from the database based on product type
        const product = await productModel.getProductByCategory(productType);
        if (!product) {
            return res.status(404).send('Product not found');
        }

        // Render the checkout page with product details
        res.render('checkout', {
            productType,
            product, // Pass the fetched product details to the view
            user: req.session.user // Pass user details
        });
    } catch (error) {
        console.error('Error fetching product details:', error);
        res.status(500).send('Server error');
    }
});

// Profile route
app.get('/profile', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login'); // Redirect to login if not logged in
    }

    const userId = req.session.user.id;

    try {
        // Fetch user details from the database using user ID
        // const user = await userModel.findById(userId); // Uncomment and implement this logic

        // Render the profile page with user details
        res.render('profile', { user: req.session.user });
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).send('Server error');
    }
});

// Logout route
app.post('/api/users/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Server error');
        }

        // Flash message for logout confirmation
        req.flash('message', 'You have logged out successfully.');
        res.redirect('/login'); // Redirect to login page after logout
    });
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
