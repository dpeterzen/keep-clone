const { createUser, getUserByEmail, updateUser, deleteUser } = require('./models/cosmosOperations'); // Adjust the path as necessary
require('dotenv').config(); // Ensures your environment variables are loaded

console.log("Cosmos DB Endpoint:", process.env.COSMOS_DB_ENDPOINT);
console.log("Cosmos DB Key:", process.env.COSMOS_DB_KEY);

// Define a dummy user with entityType
const dummyUser = {
    username: "testUser",
    email: "testuser@example.com",
    passwordHash: "dummyHash", // Normally, you'd hash this value
    entityType: "user" // Assuming 'user' is the entityType for user documents
};

async function testCRUDOperations() {
    console.log("Starting CRUD operations test...");

    // Create
    console.log("Creating user...");
    try {
        await createUser(dummyUser);
        console.log("User created:", dummyUser);
    } catch (error) {
        console.error("Error during creation:", error.message);
    }

    // Read
    console.log("Retrieving user...");
    const fetchedUser = await getUserByEmail(dummyUser.email);
    console.log("User retrieved:", fetchedUser);

    // Update
    console.log("Updating user...");
    const updatedUser = await updateUser(dummyUser.email, { username: "updatedTestUser" });
    console.log("User updated:", updatedUser);

    // Cleanup - Delete
    console.log("Deleting user...");
    try {
        await deleteUser(dummyUser.email);
        console.log("User deleted");
    } catch (error) {
        console.error("Error during deletion:", error.message);
    }

    console.log("CRUD operations test completed.");
}

testCRUDOperations().catch(err => {
    console.error("An error occurred:", err);
});