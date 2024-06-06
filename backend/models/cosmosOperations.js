const { getContainer } = require('../cosmosConfig');
const { v4: uuidv4 } = require('uuid');

async function createUserIfNotExists(userData) {
    const container = await getContainer();
    const { resources: existingUsers } = await container.items
        .query({
            query: "SELECT * FROM c WHERE c.email = @email",
            parameters: [{ name: "@email", value: userData.email }]
        })
        .fetchAll();

    if (existingUsers.length > 0) {
        console.log('User already exists');
        return null; // Explicitly return null to indicate user already exists
    }

    const user = {
        ...userData,
        id: userData.email, // Use email as ID, ensure it's unique
        entityType: 'user'
    };
    await container.items.create(user);
    return user; // Return the created user object
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

async function updateUser(userId, updates) {
    const container = await getContainer();
    try {
        const { resource: existingUser } = await container.item(userId).read();
        const updatedUser = { ...existingUser, ...updates };
        await container.item(userId).replace(updatedUser);
        return updatedUser;
    } catch (error) {
        console.error('Error updating user:', error);
        return null;
    }
}

async function deleteUser(email) {
    const container = await getContainer();
    try {
        await container.item(email).delete();
    } catch (error) {
        console.error('Error deleting user:', error);
    }
}

async function createNote(noteData) {
    const container = await getContainer();
    const note = {
        ...noteData,
        id: uuidv4(), // Assign a unique UUID
        entityType: 'note'
    };
    const { resource: createdNote } = await container.items.create(note);
    return createdNote; // Return the created note with its assigned UUID
}

async function getNoteById(noteId) {
    const container = await getContainer();
    const querySpec = {
        query: "SELECT * FROM c WHERE c.id = @id AND c.entityType = 'note'",
        parameters: [
            { name: "@id", value: noteId }
        ]
    };
    const { resources } = await container.items.query(querySpec).fetchAll();
    return resources[0];  // Return the first item if found
}

async function getNotesByUser(userId) {
    const container = await getContainer();
    const querySpec = {
        query: "SELECT * FROM c WHERE c.userId = @userId AND c.entityType = 'note'",
        parameters: [{ name: "@userId", value: userId }]
    };
    const { resources } = await container.items.query(querySpec).fetchAll();
    return resources;
}

async function updateNote(noteId, updates) {
    const container = await getContainer();
    try {
        const { resource: existingNote } = await container.item(noteId).read();
        const updatedNote = { ...existingNote, ...updates };
        await container.item(noteId).replace(updatedNote);
        return updatedNote;
    } catch (error) {
        console.error('Error updating note:', error);
        return null;
    }
}

async function deleteNote(noteId) {
    const container = await getContainer();
    try {
        await container.item(noteId).delete();
    } catch (error) {
        console.error('Error deleting note:', error);
    }
}

module.exports = {
    createUserIfNotExists,
    getUserByEmail,
    updateUser,
    deleteUser,
    createNote,
    getNoteById,
    updateNote,
    deleteNote,
    getNotesByUser
};
