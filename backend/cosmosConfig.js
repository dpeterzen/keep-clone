require('dotenv').config();
const { CosmosClient } = require('@azure/cosmos');

const endpoint = process.env.COSMOS_DB_ENDPOINT; // Add your Cosmos DB endpoint here
const key = process.env.COSMOS_DB_KEY; // Add your Cosmos DB key here
const client = new CosmosClient({ endpoint, key });

const databaseId = "KeepCloneDB";
const containerId = "Items";

async function getContainer() {
    const { database } = await client.databases.createIfNotExists({ id: databaseId });
    const { container } = await database.containers.createIfNotExists({ id: containerId });
    return container;
}

module.exports = { getContainer };
