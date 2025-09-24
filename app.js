const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Book = require('./book');

const createApp = () => {
    const app = express();
    
    // CORS middleware
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        if (req.method === 'OPTIONS') {
            res.sendStatus(200);
        } else {
            next();
        }
    });
    
    app.use(express.json());
    app.use(express.static('public'));
    
    // Serve React build files
    app.use(express.static(path.join(__dirname, 'frontend/build')));

    // Serve index.html at root
    app.get('/', (req, res) => {
        res.sendFile('index.html', { root: 'public' });
    });
    
    // Serve React app for non-API routes
    app.get('/react', (req, res) => {
        res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
    });

    app.get('/books', async (req, res) => {
        try {
            const books = await Book.find();
            res.json(books);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    app.get('/books/:id', async (req, res) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return res.status(400).json({ message: 'Invalid book ID' });
            }
            const book = await Book.findById(req.params.id);
            if (!book) return res.status(404).json({ message: 'Book not found' });
            res.json(book);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    app.post('/books', async (req, res) => {
        try {
            if (Array.isArray(req.body)) {
                const books = await Book.insertMany(req.body);
                res.status(201).json(books);
            } else {
                const book = new Book(req.body);
                await book.save();
                res.status(201).json(book);
            }
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    });

    app.put('/books/:id', async (req, res) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return res.status(400).json({ message: 'Invalid book ID' });
            }
            const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!book) return res.status(404).json({ message: 'Book not found' });
            res.json(book);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    });

    app.delete('/books/:id', async (req, res) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return res.status(400).json({ message: 'Invalid book ID' });
            }
            const book = await Book.findByIdAndDelete(req.params.id);
            if (!book) return res.status(404).json({ message: 'Book not found' });
            res.json({ message: 'Book deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    app.delete('/books', async (req, res) => {
        try {
            await Book.deleteMany();
            res.json({ message: 'All books deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    return app;
};

module.exports = createApp;