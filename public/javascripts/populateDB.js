const mongoose = require('mongoose');
const Customer = require('../../models/customer');

mongoose.connect('mongodb://localhost:27017/moneyTransfer');

const customers = [
    { name: 'Alice', email: 'alice@example.com', balance: 1000 },
    { name: 'Bob', email: 'bob@example.com', balance: 1500 },
    { name: 'Charlie', email: 'charlie@example.com', balance: 1200 },
    { name: 'David', email: 'david@example.com', balance: 1800 },
    { name: 'Eva', email: 'eva@example.com', balance: 2000 },
    { name: 'Frank', email: 'frank@example.com', balance: 1700 },
    { name: 'Grace', email: 'grace@example.com', balance: 1600 },
    { name: 'Hank', email: 'hank@example.com', balance: 1400 },
    { name: 'Ivy', email: 'ivy@example.com', balance: 1300 },
    { name: 'Jack', email: 'jack@example.com', balance: 1900 },
];

Customer.insertMany(customers)
    .then(() => {
        console.log('Database populated');
        mongoose.connection.close();
    })
    .catch(err => {
        console.error('Error populating database:', err);
    });
