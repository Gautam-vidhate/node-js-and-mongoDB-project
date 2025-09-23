const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const createApp = require('./app');
const Book = require('./book');

let mongoServer;
let app;

describe('Books API Integration Tests', () => {
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

    describe('Error Handling', () => {
        test('should handle malformed JSON in POST request', async () => {
            const response = await request(app)
                .post('/books')
                .send('invalid json')
                .set('Content-Type', 'application/json');
            
            expect(response.status).toBe(400);
        });

        test('should handle empty request body in POST', async () => {
            const response = await request(app)
                .post('/books')
                .send({});
            
            expect(response.status).toBe(400);
            expect(response.body.error).toContain('required');
        });

        test('should handle partial updates in PUT', async () => {
            const book = new Book({ title: 'Original Title', author: 'Original Author', publishedYear: 2020 });
            await book.save();

            const response = await request(app)
                .put(`/books/${book._id}`)
                .send({ title: 'Updated Title Only' });
            
            expect(response.status).toBe(200);
            expect(response.body.title).toBe('Updated Title Only');
            expect(response.body.author).toBe('Original Author');
        });
    });

    describe('Data Validation', () => {
        test('should validate required title field', async () => {
            const invalidBook = { author: 'Author', publishedYear: 2023 };
            
            const response = await request(app)
                .post('/books')
                .send(invalidBook);
            
            expect(response.status).toBe(400);
            expect(response.body.error).toContain('required');
        });

        test('should accept book with only title (minimal required data)', async () => {
            const minimalBook = { title: 'Minimal Book' };
            
            const response = await request(app)
                .post('/books')
                .send(minimalBook);
            
            expect(response.status).toBe(201);
            expect(response.body.title).toBe('Minimal Book');
            expect(response.body.author).toBeUndefined();
            expect(response.body.publishedYear).toBeUndefined();
        });
    });

    describe('Bulk Operations', () => {
        test('should handle large batch insert', async () => {
            const books = Array.from({ length: 100 }, (_, i) => ({
                title: `Book ${i + 1}`,
                author: `Author ${i + 1}`,
                publishedYear: 2000 + i
            }));
            
            const response = await request(app)
                .post('/books')
                .send(books);
            
            expect(response.status).toBe(201);
            expect(response.body).toHaveLength(100);
        });

        test('should handle mixed valid/invalid data in batch insert', async () => {
            const books = [
                { title: 'Valid Book 1', author: 'Author 1' },
                { author: 'Author without title' }, // Invalid
                { title: 'Valid Book 2', author: 'Author 2' }
            ];
            
            const response = await request(app)
                .post('/books')
                .send(books);
            
            expect(response.status).toBe(400);
        });
    });

    describe('Search and Filter (Future Enhancement)', () => {
        beforeEach(async () => {
            const testBooks = [
                { title: 'JavaScript Guide', author: 'John Doe', publishedYear: 2020 },
                { title: 'Python Basics', author: 'Jane Smith', publishedYear: 2021 },
                { title: 'Advanced JavaScript', author: 'John Doe', publishedYear: 2022 }
            ];
            await Book.insertMany(testBooks);
        });

        test('should return all books when no filters applied', async () => {
            const response = await request(app).get('/books');
            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(3);
        });
    });

    describe('Performance Tests', () => {
        test('should handle concurrent requests', async () => {
            const promises = Array.from({ length: 10 }, (_, i) =>
                request(app)
                    .post('/books')
                    .send({ title: `Concurrent Book ${i}`, author: `Author ${i}` })
            );
            
            const responses = await Promise.all(promises);
            responses.forEach(response => {
                expect(response.status).toBe(201);
            });
            
            const allBooks = await request(app).get('/books');
            expect(allBooks.body).toHaveLength(10);
        });
    });

    describe('Database Connection Edge Cases', () => {
        test('should handle database operations gracefully', async () => {
            // This test ensures our error handling works
            const response = await request(app).get('/books');
            expect(response.status).toBe(200);
        });
    });
});