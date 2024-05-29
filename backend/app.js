const express = require('express');
const bodyParser = require('body-parser');
const { CosmosClient } = require('@azure/cosmos');

require('dotenv').config();

console.log("Cosmos DB Endpoint:", process.env.COSMOS_DB_ENDPOINT);
console.log("Cosmos DB Key:", process.env.COSMOS_DB_KEY);

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Import routes
const userRoutes = require('./routes/userRoutes'); // Ensure this path is correct
const noteRoutes = require('./routes/noteRoutes'); // Ensure this path is correct

// Check and setup Cosmos DB Client
if (!process.env.COSMOS_DB_ENDPOINT || !process.env.COSMOS_DB_KEY) {
    console.error("Cosmos DB endpoint or key is not set. Please check your environment variables.");
    process.exit(1); // Exit the process with an error code
} else {
    const client = new CosmosClient({
        endpoint: process.env.COSMOS_DB_ENDPOINT,
        key: process.env.COSMOS_DB_KEY
    });
    const database = client.database('KeepCloneDB');
    const itemsContainer = database.container('Items'); // Using a single container for both users and notes

    // Ensure client and containers are accessible in routes if necessary
    app.locals.itemsContainer = itemsContainer;

    // Use Routes
    app.use('/api/users', userRoutes);
    app.use('/api/notes', noteRoutes);

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
}
