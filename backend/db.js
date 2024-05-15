const { CosmosClient } = require('@azure/cosmos');
const client = new CosmosClient(process.env.COSMOS_DB_CONNECTION_STRING);

const database = client.database('KeepCloneDB');
const usersContainer = database.container('Users');
const notesContainer = database.container('Notes');

module.exports = {
  usersContainer,
  notesContainer
};
