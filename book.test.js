const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Book = require('./book');

let mongoServer;

describe('Book Model', () => {
    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri);
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    beforeEach(async () => {
        await Book.deleteMany({});
    });

    describe('Schema Validation', () => {
        test('should create a book with valid data', async () => {
            const bookData = {
                title: 'Test Book',
                author: 'Test Author',
                publishedYear: 2023
            };
            
            const book = new Book(bookData);
            const savedBook = await book.save();
            
            expect(savedBook._id).toBeDefined();
            expect(savedBook.title).toBe('Test Book');
            expect(savedBook.author).toBe('Test Author');
            expect(savedBook.publishedYear).toBe(2023);
        });

        test('should require title field', async () => {
            const bookData = {
                author: 'Test Author',
                publishedYear: 2023
            };
            
            const book = new Book(bookData);
            
            await expect(book.save()).rejects.toThrow(/required/);
        });

        test('should allow book with only title', async () => {
            const bookData = {
                title: 'Only Title Book'
            };
            
            const book = new Book(bookData);
            const savedBook = await book.save();
            
            expect(savedBook.title).toBe('Only Title Book');
            expect(savedBook.author).toBeUndefined();
            expect(savedBook.publishedYear).toBeUndefined();
        });

        test('should accept string for author field', async () => {
            const bookData = {
                title: 'Test Book',
                author: 'Test Author'
            };
            
            const book = new Book(bookData);
            const savedBook = await book.save();
            
            expect(savedBook.author).toBe('Test Author');
        });

        test('should accept number for publishedYear field', async () => {
            const bookData = {
                title: 'Test Book',
                publishedYear: 2023
            };
            
            const book = new Book(bookData);
            const savedBook = await book.save();
            
            expect(savedBook.publishedYear).toBe(2023);
        });

        test('should handle empty strings', async () => {
            const bookData = {
                title: '',
                author: '',
                publishedYear: null
            };
            
            const book = new Book(bookData);
            
            // Empty title should fail validation
            await expect(book.save()).rejects.toThrow();
        });
    });

    describe('Model Methods', () => {
        test('should find books by title', async () => {
            await Book.create([
                { title: 'JavaScript Guide', author: 'John Doe' },
                { title: 'Python Basics', author: 'Jane Smith' },
                { title: 'JavaScript Advanced', author: 'John Doe' }
            ]);
            
            const jsBooks = await Book.find({ title: /JavaScript/ });
            expect(jsBooks).toHaveLength(2);
        });

        test('should find books by author', async () => {
            await Book.create([
                { title: 'Book 1', author: 'John Doe' },
                { title: 'Book 2', author: 'Jane Smith' },
                { title: 'Book 3', author: 'John Doe' }
            ]);
            
            const johnBooks = await Book.find({ author: 'John Doe' });
            expect(johnBooks).toHaveLength(2);
        });

        test('should update book fields', async () => {
            const book = await Book.create({
                title: 'Original Title',
                author: 'Original Author',
                publishedYear: 2020
            });
            
            book.title = 'Updated Title';
            book.publishedYear = 2023;
            const updatedBook = await book.save();
            
            expect(updatedBook.title).toBe('Updated Title');
            expect(updatedBook.author).toBe('Original Author');
            expect(updatedBook.publishedYear).toBe(2023);
        });

        test('should delete book', async () => {
            const book = await Book.create({
                title: 'Book to Delete',
                author: 'Author'
            });
            
            await Book.findByIdAndDelete(book._id);
            const deletedBook = await Book.findById(book._id);
            
            expect(deletedBook).toBeNull();
        });
    });

    describe('Data Types and Constraints', () => {
        test('should handle special characters in title', async () => {
            const bookData = {
                title: 'Book with Special Characters: @#$%^&*()',
                author: 'Test Author'
            };
            
            const book = new Book(bookData);
            const savedBook = await book.save();
            
            expect(savedBook.title).toBe('Book with Special Characters: @#$%^&*()');
        });

        test('should handle long strings', async () => {
            const longTitle = 'A'.repeat(1000);
            const bookData = {
                title: longTitle,
                author: 'Test Author'
            };
            
            const book = new Book(bookData);
            const savedBook = await book.save();
            
            expect(savedBook.title).toBe(longTitle);
        });

        test('should handle negative published year', async () => {
            const bookData = {
                title: 'Ancient Book',
                publishedYear: -500
            };
            
            const book = new Book(bookData);
            const savedBook = await book.save();
            
            expect(savedBook.publishedYear).toBe(-500);
        });
    });
});