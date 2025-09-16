const express = require('express');
const mongoose = require('mongoose');
const Book = require('./book');

const app = express();
app.use(express.json());

const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';

mongoose.connect(mongoURI)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

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
        // Check if the request body is an array of objects
        if (Array.isArray(req.body)) {
            const books = await Book.insertMany(req.body);
            res.status(201).json(books);
        } else {
            // Handle single object as before
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});