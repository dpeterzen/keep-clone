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

module.exports = { createUser, getUserByEmail, updateUser, deleteUser, createNote };
