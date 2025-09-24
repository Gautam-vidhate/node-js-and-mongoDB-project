import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaBook, FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import BookList from './components/BookList';
import BookForm from './components/BookForm';
import Statistics from './components/Statistics';
import SearchFilter from './components/SearchFilter';
import { bookService } from './services/bookService';

function App() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const data = await bookService.getAllBooks();
      setBooks(data);
      setFilteredBooks(data);
    } catch (error) {
      toast.error('Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = async (bookData) => {
    try {
      const newBook = await bookService.createBook(bookData);
      const authorInfo = newBook.author ? ` by ${newBook.author}` : '';
      const yearInfo = newBook.publishedYear ? ` (${newBook.publishedYear})` : '';
      toast.success(`Book "${newBook.title}"${authorInfo}${yearInfo} added successfully`);
      fetchBooks();
    } catch (error) {
      toast.error('Failed to add book');
    }
  };

  const handleUpdateBook = async (id, bookData) => {
    try {
      const updatedBook = await bookService.updateBook(id, bookData);
      const authorInfo = updatedBook.author ? ` by ${updatedBook.author}` : '';
      const yearInfo = updatedBook.publishedYear ? ` (${updatedBook.publishedYear})` : '';
      toast.success(`Book "${updatedBook.title}"${authorInfo}${yearInfo} updated successfully`);
      setEditingBook(null);
      fetchBooks();
    } catch (error) {
      toast.error('Failed to update book');
    }
  };

  const handleDeleteBook = async (id) => {
    const book = books.find(b => b._id === id);
    const bookTitle = book ? book.title : 'Unknown';
    const authorInfo = book && book.author ? ` by ${book.author}` : '';
    const yearInfo = book && book.publishedYear ? ` (${book.publishedYear})` : '';
    
    if (window.confirm(`Are you sure you want to delete "${bookTitle}"?`)) {
      try {
        await bookService.deleteBook(id);
        toast.success(`Book "${bookTitle}"${authorInfo}${yearInfo} deleted successfully`);
        fetchBooks();
      } catch (error) {
        toast.error('Failed to delete book');
      }
    }
  };

  const handleFilter = (filters) => {
    let filtered = books;
    
    if (filters.title) {
      filtered = filtered.filter(book => 
        book.title.toLowerCase().includes(filters.title.toLowerCase())
      );
    }
    
    if (filters.author) {
      filtered = filtered.filter(book => 
        book.author && book.author.toLowerCase().includes(filters.author.toLowerCase())
      );
    }
    
    if (filters.year) {
      filtered = filtered.filter(book => book.publishedYear == filters.year);
    }
    
    setFilteredBooks(filtered);
  };

  return (
    <div className="container">
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: 'white', fontSize: '2.5em', marginBottom: '10px' }}>
          <FaBook /> Books API Management System
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1em' }}>
          React Frontend with Complete CRUD Operations
        </p>
      </header>

      <Statistics books={books} />
      
      <SearchFilter onFilter={handleFilter} books={books} />
      
      <div className="grid">
        <BookForm 
          onSubmit={editingBook ? 
            (data) => handleUpdateBook(editingBook._id, data) : 
            handleAddBook
          }
          initialData={editingBook}
          isEditing={!!editingBook}
          onCancel={() => setEditingBook(null)}
        />
        
        <BookList 
          books={filteredBooks}
          loading={loading}
          onEdit={setEditingBook}
          onDelete={handleDeleteBook}
        />
      </div>

      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;