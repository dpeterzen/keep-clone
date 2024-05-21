const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, getUserByEmail } = require('../models/cosmosOperations'); // Adjust the path as necessary

// Middleware to verify the token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];  // Bearer TOKEN_STRING

    if (token == null) {
        return res.sendStatus(401);  // No token provided
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403);  // Invalid token
        }
        req.user = user;
        next();  // proceed to the next middleware or route handler
    });
};

// Register route
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return res.status(409).send({ message: 'User already exists with this email.' });
        }
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);
        await createUser({ username, email, passwordHash, entityType: 'user' }); // Include entityType when creating a user
        res.status(201).send({ message: 'User registered successfully.' });
    } catch (error) {
        res.status(500).send({ message: 'Error registering new user.', error: error.message });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(404).send({ message: 'User not found.' });
        }
        const match = await bcrypt.compare(password, user.passwordHash);
        if (!match) {
            return res.status(401).send({ message: 'Invalid credentials.' });
        }
        const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.status(200).send({ token, message: 'Logged in successfully.' });
    } catch (error) {
        res.status(500).send({ message: 'Error logging in.', error: error.message });
    }
});

module.exports = router;
