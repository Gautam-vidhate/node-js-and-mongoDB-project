# Books API Server

A RESTful API server for managing books using Express.js and MongoDB.

## Features

- CRUD operations for books
- MongoDB integration with Mongoose
- Comprehensive test suite
- Error handling and validation
- Support for single and bulk operations

## Installation

```bash
npm install
```

## Running the Server

```bash
npm start
```

The server will start on port 3000 (or the port specified in the PORT environment variable).

## API Endpoints

### GET /books
Get all books

### GET /books/:id
Get a specific book by ID

### POST /books
Create a new book or multiple books
- Single book: `{ "title": "Book Title", "author": "Author Name", "publishedYear": 2023 }`
- Multiple books: `[{ "title": "Book 1", ... }, { "title": "Book 2", ... }]`

### PUT /books/:id
Update a book by ID

### DELETE /books/:id
Delete a specific book by ID

### DELETE /books
Delete all books

## Testing

### Run All Tests
```bash
npm test
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Run Unit Tests Only
```bash
npm run test:unit
```

### Run Integration Tests Only
```bash
npm run test:integration
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

## Test Structure

- `book.test.js` - Unit tests for the Book model
- `server.test.js` - API endpoint tests
- `server.integration.test.js` - Integration and edge case tests

## Environment Variables

- `MONGODB_URI` - MongoDB connection string (default: mongodb://127.0.0.1:27017)
- `PORT` - Server port (default: 3000)

## Project Structure

```
├── app.js                     # Express app configuration
├── server.js                  # Server startup
├── book.js                    # Book model
├── book.test.js              # Book model tests
├── server.test.js            # API tests
├── server.integration.test.js # Integration tests
├── jest.config.js            # Jest configuration
├── jest.setup.js             # Jest setup
└── package.json              # Dependencies and scripts
```

## Testing Features

The test suite includes:

- **Unit Tests**: Model validation and methods
- **Integration Tests**: API endpoint functionality
- **Error Handling**: Invalid inputs and edge cases
- **Bulk Operations**: Multiple record operations
- **Performance Tests**: Concurrent request handling
- **Database Tests**: MongoDB operations with in-memory database

## Coverage

Run `npm run test:coverage` to generate a coverage report. The tests aim for high coverage of:
- All API endpoints
- Error scenarios
- Data validation
- Database operations