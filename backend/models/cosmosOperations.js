const { getContainer } = require('../cosmosConfig'); // Adjust path as needed

async function createUser(userData) {
    const container = await getContainer();
    const { username, email, passwordHash } = userData;
    const user = {
        id: email,  // Using email as the unique ID
        entityType: 'user',
        username,
        passwordHash,
        email
    };
    await container.items.create(user);
}

async function getUserByEmail(email) {
    const container = await getContainer();
    const querySpec = {
        query: "SELECT * FROM c WHERE c.id = @id AND c.entityType = 'user'",
        parameters: [{ name: "@id", value: email }]
    };
    const { resources } = await container.items.query(querySpec).fetchAll();
    return resources[0];
}

async function createNote(noteData) {
    const container = await getContainer();
    const { userId, title, content, createdAt, tags } = noteData;
    const note = {
        id: `note${new Date().getTime()}`, // Generating unique IDs for notes
        entityType: 'note',
        userId,
        title,
        content,
        createdAt,
        tags
    };
    await container.items.create(note);
}

module.exports = { createUser, getUserByEmail, createNote };
