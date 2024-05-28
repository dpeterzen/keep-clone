const { getContainer } = require('../cosmosConfig'); // Adjust path as needed
const { v4: uuidv4 } = require('uuid');

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

async function updateUser(email, updates) {
    const container = await getContainer();
    try {
        const { resource: user } = await container.item(email, 'user').read(); // Here 'user' should be the partition key value if 'entityType' is the partition key
        if (!user) {
            console.log("User not found");
            return;
        }
        const updatedUser = { ...user, ...updates };
        await container.item(email, 'user').replace(updatedUser); // Ensure correct partition key usage
        console.log("User updated:", updatedUser);
        return updatedUser;
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
}

async function deleteUser(email) {
    const container = await getContainer();
    const user = await getUserByEmail(email);
    if (!user) {
        return null; // or handle as you see fit
    }
    await container.item(email, user.entityType).delete();  // Correctly reference the partition key
}

async function createNote(noteData) {
    const container = await getContainer();
    if (!noteData.userId) {
        throw new Error("userId must be provided for note creation");
    }
    const note = {
        ...noteData,
        id: uuidv4(), // Assign a unique UUID
        entityType: 'note' // Ensure partition key is set correctly
    };
    await container.items.create(note);
}

async function getNoteById(noteId) {
    const container = await getContainer();
    try {
        const { resource: note } = await container.item(noteId, 'note').read(); // 'note' as partition key value
        return note;
    } catch (error) {
        console.error('Error fetching note by ID:', error);
        return null; // Handle error appropriately
    }
}

async function updateNote(noteId, updates) {
    const container = await getContainer();
    try {
        const { resource: existingNote } = await container.item(noteId, 'note').read();
        const updatedNote = { ...existingNote, ...updates };
        await container.item(noteId, 'note').replace(updatedNote);
        return updatedNote;
    } catch (error) {
        console.error('Error updating note:', error);
        return null; // Handle error appropriately
    }
}

async function deleteNote(noteId) {
    const container = await getContainer();
    try {
        await container.item(noteId, 'note').delete();
    } catch (error) {
        console.error('Error deleting note:', error);
    }
}

async function getNotesByUser(userId) {
    const container = await getContainer();
    const querySpec = {
        query: "SELECT * FROM c WHERE c.userId = @userId AND c.entityType = 'note'",
        parameters: [
            { name: "@userId", value: userId }
        ]
    };
    const { resources } = await container.items.query(querySpec).fetchAll();
    return resources;
}

module.exports = {
    createUser,
    getUserByEmail,
    updateUser,
    deleteUser,
    createNote,
    getNoteById,
    updateNote,
    deleteNote,
    getNotesByUser
};
