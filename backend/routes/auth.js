const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { usersContainer } = require('../db'); // Adjust the path as necessary

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
  const { username, password, email } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = {
    id: `user_${Date.now()}`,
    username,
    passwordHash,
    email
  };

  await usersContainer.items.create(newUser);
  res.status(201).send('User registered successfully');
});

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const { resources: users } = await usersContainer.items
    .query({ query: 'SELECT * FROM Users u WHERE u.username = @username', parameters: [{ name: '@username', value: username }] })
    .fetchAll();

  if (users.length === 0) return res.status(400).send('User not found');

  const user = users[0];
  const isValidPassword = await bcrypt.compare(password, user.passwordHash);
  if (!isValidPassword) return res.status(400).send('Invalid password');

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
  res.json({ token });
});

module.exports = router;
