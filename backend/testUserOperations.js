const { createUserIfNotExists, getUserByEmail, updateUser, deleteUser } = require('./models/cosmosOperations'); // Adjust the path as necessary
const bcrypt = require('bcrypt');
require('dotenv').config(); // Ensures your environment variables are loaded

async function testCRUDOperations() {
    // Define a dummy user with entityType
    // Hash the password
    const passwordHash = await bcrypt.hash("dummyHash", 10);

    const dummyUser = {
        username: "testUser2",
        email: "testuser2@example.com",
        passwordHash: passwordHash, // Normally, you'd hash this value
        entityType: "user" // Assuming 'user' is the entityType for user documents
    };
    console.log("Starting CRUD operations test...");

    // Create
    console.log("Creating user...");
    try {
        await createUserIfNotExists(dummyUser);
        console.log("User created:", dummyUser);
    } catch (error) {
        console.error("Error during creation:", error.message);
    }
    // Read
    console.log("Retrieving user...");
    const fetchedUser = await getUserByEmail(dummyUser.email);
    console.log("User retrieved:", fetchedUser);

    // // Update
    // console.log("Updating user with ID:", dummyUser.email);
    // try {
    //     const updatedUser = await updateUser(dummyUser.email, { username: "updatedTestUser" });
    //     if (updatedUser) {
    //         console.log("User updated:", updatedUser);
    //     } else {
    //         console.log("User not found or update failed");
    //     }
    // } catch (error) {
    //     console.error("Error during update:", error.message);
    // }

    // // Delete
    // console.log("Deleting user with ID:", dummyUser.email);
    // try {
    //     await deleteUser(dummyUser.email);
    //     console.log("User deleted");
    // } catch (error) {
    //     console.error("Error during deletion:", error.message);
    // }
}

testCRUDOperations().catch(err => {
    console.error("An error occurred:", err);
});