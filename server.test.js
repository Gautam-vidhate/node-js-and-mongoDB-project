const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const createApp = require('./app');
const Book = require('./book');

let mongoServer;
let app;

describe('Books API', () => {
    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri);
        app = createApp();
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    beforeEach(async () => {
        await Book.deleteMany({});
    });

    describe('GET /books', () => {
        test('should return empty array when no books exist', async () => {
            const response = await request(app).get('/books');
            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });

        test('should return all books', async () => {
            const testBooks = [
                { title: 'Book 1', author: 'Author 1', publishedYear: 2021 },
                { title: 'Book 2', author: 'Author 2', publishedYear: 2022 }
            ];
            await Book.insertMany(testBooks);

            const response = await request(app).get('/books');
            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(2);
            expect(response.body[0].title).toBe('Book 1');
            expect(response.body[1].title).toBe('Book 2');
        });
    });

    describe('GET /books/:id', () => {
        test('should return a book by valid ID', async () => {
            const book = new Book({ title: 'Test Book', author: 'Test Author', publishedYear: 2023 });
            await book.save();

            const response = await request(app).get(`/books/${book._id}`);
            expect(response.status).toBe(200);
            expect(response.body.title).toBe('Test Book');
            expect(response.body.author).toBe('Test Author');
        });

        test('should return 400 for invalid book ID', async () => {
            const response = await request(app).get('/books/invalid-id');
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Invalid book ID');
        });

        test('should return 404 for non-existent book ID', async () => {
            const nonExistentId = new mongoose.Types.ObjectId();
            const response = await request(app).get(`/books/${nonExistentId}`);
            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Book not found');
        });
    });

    describe('POST /books', () => {
        test('should create a single book', async () => {
            const bookData = { title: 'New Book', author: 'New Author', publishedYear: 2023 };
            
            const response = await request(app)
                .post('/books')
                .send(bookData);
            
            expect(response.status).toBe(201);
            expect(response.body.title).toBe('New Book');
            expect(response.body.author).toBe('New Author');
            expect(response.body._id).toBeDefined();
        });

        test('should create multiple books', async () => {
            const booksData = [
                { title: 'Book 1', author: 'Author 1', publishedYear: 2021 },
                { title: 'Book 2', author: 'Author 2', publishedYear: 2022 }
            ];
            
            const response = await request(app)
                .post('/books')
                .send(booksData);
            
            expect(response.status).toBe(201);
            expect(response.body).toHaveLength(2);
            expect(response.body[0].title).toBe('Book 1');
            expect(response.body[1].title).toBe('Book 2');
        });

        test('should return 400 for missing required fields', async () => {
            const invalidBookData = { author: 'Author without title' };
            
            const response = await request(app)
                .post('/books')
                .send(invalidBookData);
            
            expect(response.status).toBe(400);
            expect(response.body.error).toContain('required');
        });
    });

    describe('PUT /books/:id', () => {
        test('should update an existing book', async () => {
            const book = new Book({ title: 'Original Title', author: 'Original Author', publishedYear: 2020 });
            await book.save();

            const updateData = { title: 'Updated Title', author: 'Updated Author', publishedYear: 2023 };
            
            const response = await request(app)
                .put(`/books/${book._id}`)
                .send(updateData);
            
            expect(response.status).toBe(200);
            expect(response.body.title).toBe('Updated Title');
            expect(response.body.author).toBe('Updated Author');
            expect(response.body.publishedYear).toBe(2023);
        });

        test('should return 400 for invalid book ID', async () => {
            const response = await request(app)
                .put('/books/invalid-id')
                .send({ title: 'Updated Title' });
            
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Invalid book ID');
        });

        test('should return 404 for non-existent book ID', async () => {
            const nonExistentId = new mongoose.Types.ObjectId();
            const response = await request(app)
                .put(`/books/${nonExistentId}`)
                .send({ title: 'Updated Title' });
            
            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Book not found');
        });
    });

    describe('DELETE /books/:id', () => {
        test('should delete an existing book', async () => {
            const book = new Book({ title: 'Book to Delete', author: 'Author', publishedYear: 2023 });
            await book.save();

            const response = await request(app).delete(`/books/${book._id}`);
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Book deleted successfully');

            const deletedBook = await Book.findById(book._id);
            expect(deletedBook).toBeNull();
        });

        test('should return 400 for invalid book ID', async () => {
            const response = await request(app).delete('/books/invalid-id');
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Invalid book ID');
        });

        test('should return 404 for non-existent book ID', async () => {
            const nonExistentId = new mongoose.Types.ObjectId();
            const response = await request(app).delete(`/books/${nonExistentId}`);
            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Book not found');
        });
    });

    describe('DELETE /books', () => {
        test('should delete all books', async () => {
            const testBooks = [
                { title: 'Book 1', author: 'Author 1', publishedYear: 2021 },
                { title: 'Book 2', author: 'Author 2', publishedYear: 2022 }
            ];
            await Book.insertMany(testBooks);

            const response = await request(app).delete('/books');
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('All books deleted successfully');

            const remainingBooks = await Book.find();
            expect(remainingBooks).toHaveLength(0);
        });

        test('should handle deleting from empty collection', async () => {
            const response = await request(app).delete('/books');
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('All books deleted successfully');
        });
    });
});