const express = require('express');
const bodyParser = require('body-parser');
const { CosmosClient } = require('@azure/cosmos');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Import user routes
const userRoutes = require('./routes/userRoutes'); // Adjust the path as necessary

// Setup Cosmos DB Client
const client = new CosmosClient(process.env.COSMOS_DB_CONNECTION_STRING);
const database = client.database('KeepCloneDB');
const itemsContainer = database.container('Items'); // Using a single container for both users and notes

// Use User Routes
app.use('/api/users', userRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
