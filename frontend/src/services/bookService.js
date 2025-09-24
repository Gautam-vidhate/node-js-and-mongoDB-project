import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const bookService = {
  // Get all books
  getAllBooks: async () => {
    const response = await api.get('/books');
    return response.data;
  },

  // Get single book by ID
  getBookById: async (id) => {
    const response = await api.get(`/books/${id}`);
    return response.data;
  },

  // Create new book
  createBook: async (bookData) => {
    const response = await api.post('/books', bookData);
    return response.data;
  },

  // Create multiple books
  createMultipleBooks: async (booksData) => {
    const response = await api.post('/books', booksData);
    return response.data;
  },

  // Update book
  updateBook: async (id, bookData) => {
    const response = await api.put(`/books/${id}`, bookData);
    return response.data;
  },

  // Delete book
  deleteBook: async (id) => {
    const response = await api.delete(`/books/${id}`);
    return response.data;
  },

  // Delete all books
  deleteAllBooks: async () => {
    const response = await api.delete('/books');
    return response.data;
  },
};