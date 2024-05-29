const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUserIfNotExists, getUserByEmail } = require('../models/cosmosOperations');
const authenticateToken = require('../middleware/authenticate');
const { generateToken } = require('../services/authService');

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
        const token = generateToken(user);
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

// Delete user
router.delete('/users/:email', authenticateToken, async (req, res) => {
    const email = req.params.email;

    try {
        // First, find the user to ensure they exist and to get their ID (which is their email)
        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(404).send({ message: 'User not found.' });
        }

        // Proceed to delete the user using their email as ID
        await deleteUser(user.id);  // user.id is the email in this setup
        res.status(200).send({ message: 'User deleted successfully.' });
    } catch (error) {
        res.status(500).send({ message: 'Error deleting user', error: error.message });
    }
});

module.exports = router;
