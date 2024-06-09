const express = require('express');
const mongoose = require('mongoose');
const Customer = require('./models/customer'); // Import the Customer model

const app = express(); // Create an Express app

mongoose.connect('mongodb://localhost:27017/moneyTransfer'); // Connect to MongoDB

app.use(express.urlencoded({ extended: true })); // Middleware for parsing URL-encoded data
app.use(express.static('public')); // Serve static files from the 'public' directory
app.set('view engine', 'ejs'); // Set the view engine to EJS

// Home Page
app.get('/', (req, res) => {
    res.render('home'); // Render the 'home' view
});

// View All Customers
app.get('/customers', async (req, res) => {
    const customers = await Customer.find(); // Retrieve all customers from the database
    res.render('customers', { customers }); // Render the 'customers' view with customer data
});

// Transfer Money Page
app.get('/transfer/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id); // Find a customer by ID
    const otherCustomers = await Customer.find({ _id: { $ne: req.params.id } }); // Find other customers (excluding the current one)
    res.render('transfer', { customer, otherCustomers }); // Render the 'transfer' view with customer and otherCustomers data
});

// Error route
app.get('/error', (req, res) => {
    res.status(500).render('error'); // Render the 'error' view with a 500 status code
});

// Transfer Money Action
app.post('/transfer', async (req, res) => {
    const { fromId, toId, amount } = req.body; // Extract data from the request body

    try {
        // Find sender and receiver
        const fromCustomer = await Customer.findById(fromId);
        const toCustomer = await Customer.findById(toId);

        // Check if sender and receiver exist
        if (!fromCustomer || !toCustomer) {
            throw new Error('Sender or receiver not found');
        }

        // Validate amount
        const parsedAmount = parseFloat(amount); //converts string into float
        // isNaN checks whether parsedAmount is a number or not
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            throw new Error('Invalid amount');
        }

        // Check if sender has sufficient balance
        if (fromCustomer.balance < parsedAmount) {
            throw new Error(`Insufficient balance. Current balance: ${fromCustomer.balance}`);
        }

        // Update balances
        fromCustomer.balance -= parsedAmount;
        toCustomer.balance += parsedAmount;

        // Save changes
        await fromCustomer.save();
        await toCustomer.save();

        // Redirect to success page
        res.redirect('/customers');
    } catch (error) {
        // Handle errors
        console.error(error);
        res.redirect('/error'); // Redirect to error page or transfer form with error message
    }
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000'); // Start the server
});
