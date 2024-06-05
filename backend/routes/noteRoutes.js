const express = require('express');
const router = express.Router();
const { getNotesByUser, createNote, getNoteById, updateNote, deleteNoteIfOwner } = require('../models/cosmosOperations');
const authenticateToken = require('../middleware/authenticate');

router.use(authenticateToken);  // Apply authentication middleware to all note routes

// Create a new note
router.post('/', async (req, res) => {
    const newNote = {
        userId: req.user.email,  // Assuming this is added by your authentication middleware
        title: req.body.title,
        content: req.body.content, // This could include text, links, images, etc.
        createdAt: new Date().toISOString(),  // Optionally set creation date here
        tags: req.body.tags,  // Assuming tags are included in the request
        entityType: 'note'  // Explicitly setting the entityType to 'note'
    };
    try {
        const createdNote = await createNote(newNote);  // It's a good practice to return the created note
        res.status(201).send({ message: 'Note created successfully', data: createdNote });
    } catch (error) {
        res.status(500).send({ message: 'Failed to create note', error: error.message });
    }
});

// Retrieve a specific note by ID
router.get('/:id', async (req, res) => {
    try {
        const note = await getNoteById(req.params.id);
        if (!note) {
            return res.status(404).send({ message: 'Note not found' });
        }
        // Check if the logged-in user's userId matches the note's userId
        if (note.userId !== req.user.email) {
            return res.status(403).send({ message: 'Access denied' });
        }

        res.status(200).send(note);
    } catch (error) {
        res.status(500).send({ message: 'Error retrieving note', error: error.toString() });
    }
});

// Get all notes for the logged-in user
router.get('/', async (req, res) => {
    try {
        const userId = req.user.email;  // Extract userId from decoded JWT token added by the authenticate middleware
        const notes = await getNotesByUser(userId);
        if (notes.length === 0) {
            res.status(404).send({ message: 'No notes found for this user.' });
        } else {
            res.status(200).send(notes);
        }
    } catch (error) {
        res.status(500).send({ message: 'Error retrieving notes', error: error.toString() });
    }
});

// Update a note
router.put('/:id', async (req, res) => {
    try {
        // First, verify the note exists
        const note = await getNoteById(req.params.id);
        if (!note) {
            return res.status(404).send({ message: 'Note not found' });
        }

        // Check if the logged-in user's userId matches the note's userId
        if (note.userId !== req.user.email) {
            return res.status(403).send({ message: 'Access denied' });
        }

        // If ownership is confirmed, proceed to update the note
        const updatedNote = await updateNote(req.params.id, req.body);
        if (!updatedNote) {
            return res.status(404).send({ message: 'Failed to update note' });
        } else {
            return res.status(200).send(updatedNote);
        }
    } catch (error) {
        res.status(500).send({ message: 'Error updating note', error: error.toString() });
    }
});

// Delete note(s) by ids
router.delete('/', async (req, res) => {
    const uuidsList = req.body.ids; // List of note IDs to delete
    const userId = req.user.email; // User ID from the JWT token
    try {
        for (const id of uuidsList) {
            await deleteNoteIfOwner(id, userId);
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).send({ message: `Error processing your request: ${error.message}`, userId: userId });
    }
});

module.exports = router;
