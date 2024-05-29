const express = require('express');
const router = express.Router();
const { createNote, getNoteById, updateNote, deleteNote } = require('../models/cosmosOperations');
const authenticate = require('../middleware/authenticate');

router.use(authenticate);  // Apply authentication middleware to all note routes

// Create a new note
router.post('/notes', async (req, res) => {
    const newNote = {
        userId: req.user.userId,  // Assuming this is added by your authentication middleware
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

// Retrieve a note
router.get('/notes/:id', async (req, res) => {
    try {
        const note = await getNoteById(req.params.id);
        if (!note) {
            res.status(404).send({ message: 'Note not found' });
        } else {
            res.status(200).send(note);
        }
    } catch (error) {
        res.status(500).send({ message: 'Error retrieving note', error: error.toString() });
    }
});

// Update a note
router.put('/notes/:id', async (req, res) => {
    try {
        const updatedNote = await updateNote(req.params.id, req.user.userId, req.body);
        if (!updatedNote) {
            res.status(404).send({ message: 'Failed to update note' });
        } else {
            res.status(200).send(updatedNote);
        }
    } catch (error) {
        res.status(500).send({ message: 'Error updating note', error: error.toString() });
    }
});

// Delete a note
router.delete('/notes/:id', async (req, res) => {
    try {
        await deleteNote(req.params.id, req.user.userId);
        res.status(204).send();
    } catch (error) {
        res.status(500).send({ message: 'Error deleting note', error: error.message });
    }
});

module.exports = router;
