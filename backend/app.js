require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { CosmosClient } = require('@azure/cosmos');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

const client = new CosmosClient(process.env.COSMOS_DB_CONNECTION_STRING);
const database = client.database('KeepCloneDB');
const usersContainer = database.container('Users');
const notesContainer = database.container('Notes');

// Add your routes here

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
