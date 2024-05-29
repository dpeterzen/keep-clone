const { createNote, getNoteById, updateNote, deleteNote } = require('./models/cosmosOperations');
require('dotenv').config();

console.log("Cosmos DB Endpoint:", process.env.COSMOS_DB_ENDPOINT);
console.log("Cosmos DB Key:", process.env.COSMOS_DB_KEY);

// Define a dummy note without an ID
const dummyNote = {
    entityType: "note",
    userId: "user1@email.neenja",
    title: "First Note",
    content: "This is the content of the first note.",
    createdAt: new Date().toISOString(),
    tags: ["personal", "important"]
};

async function testCRUDOperationsForNotes() {
    console.log("Starting CRUD operations test for notes...");

    // Create
    console.log("Creating note...");
    try {
        const createdNote = await createNote(dummyNote);
        console.log("Note created:", createdNote);

        // Read
        console.log("Retrieving note...");
        const fetchedNote = await getNoteById(createdNote.id);
        console.log("Note retrieved:", fetchedNote);

        // Update
        console.log("Updating note...");
        const updates = { content: "Updated content of the note." };
        const updatedNote = await updateNote(createdNote.id, updates);
        console.log("Note updated:", updatedNote);

        // Cleanup - Delete
        console.log("Deleting note...");
        await deleteNote(createdNote.id);
        console.log("Note deleted");

    } catch (error) {
        console.error("Error during operation:", error.message);
    }

    console.log("CRUD operations test for notes completed.");
}

testCRUDOperationsForNotes().catch(err => {
    console.error("An error occurred:", err);
});
