const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUserIfNotExists, getUserByEmail } = require('../models/cosmosOperations');
const authenticateToken = require('../middleware/authenticate');

// Register route
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Hash the password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Prepare user data
        const userData = {
            username,
            email,
            passwordHash,
            entityType: 'user' // Explicitly setting the entityType
        };

        // Attempt to create user if not exists
        const newUser = await createUserIfNotExists(userData);

        if (!newUser) {
            return res.status(409).send({ message: 'User already exists with this email.' });
        }

        res.status(201).send({ message: 'User registered successfully.', user: newUser });
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

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const user = await getUserByEmail(req.user.email);
        if (!user) return res.status(404).send({ message: 'User not found.' });

        const { passwordHash, ...userWithoutSensitiveInfo } = user;
        res.status(200).send(userWithoutSensitiveInfo);
    } catch (error) {
        res.status(500).send({ message: 'Error retrieving user profile.', error: error.message });
    }
});

module.exports = router;
