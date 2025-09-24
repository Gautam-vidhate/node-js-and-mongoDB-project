import axios from 'axios';
import { Book, BookFormData } from '../types/Book';

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
  getAllBooks: async (): Promise<Book[]> => {
    const response = await api.get<Book[]>('/books');
    return response.data;
  },

  getBookById: async (id: string): Promise<Book> => {
    const response = await api.get<Book>(`/books/${id}`);
    return response.data;
  },

  createBook: async (bookData: BookFormData): Promise<Book> => {
    const response = await api.post<Book>('/books', bookData);
    return response.data;
  },

  createMultipleBooks: async (booksData: BookFormData[]): Promise<Book[]> => {
    const response = await api.post<Book[]>('/books', booksData);
    return response.data;
  },

  updateBook: async (id: string, bookData: Partial<BookFormData>): Promise<Book> => {
    const response = await api.put<Book>(`/books/${id}`, bookData);
    return response.data;
  },

  deleteBook: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/books/${id}`);
    return response.data;
  },

  deleteAllBooks: async (): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>('/books');
    return response.data;
  },
};