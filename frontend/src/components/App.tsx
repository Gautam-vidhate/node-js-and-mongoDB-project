import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Book } from '../types/Book';
import { bookService } from '../services/bookService';
import BookList from './BookList';
import BookForm from './BookForm';
import Statistics from './Statistics';
import SearchFilter from './SearchFilter';

const App: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async (): Promise<void> => {
    try {
      setLoading(true);
      const data = await bookService.getAllBooks();
      setBooks(data);
      setFilteredBooks(data);
    } catch (error) {
      toast.error('Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm: string, authorFilter: string, yearFilter: string): void => {
    let filtered = books;

    if (searchTerm) {
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (authorFilter) {
      filtered = filtered.filter(book =>
        book.author.toLowerCase().includes(authorFilter.toLowerCase())
      );
    }

    if (yearFilter) {
      filtered = filtered.filter(book =>
        book.publishedYear.toString() === yearFilter
      );
    }

    setFilteredBooks(filtered);
  };

  const handleBookAdded = (newBook: Book): void => {
    setBooks(prev => [...prev, newBook]);
    setFilteredBooks(prev => [...prev, newBook]);
    toast.success(`Book "${newBook.title}" added successfully!`);
  };

  const handleBookUpdated = (updatedBook: Book): void => {
    setBooks(prev => prev.map(book => book._id === updatedBook._id ? updatedBook : book));
    setFilteredBooks(prev => prev.map(book => book._id === updatedBook._id ? updatedBook : book));
    toast.success(`Book "${updatedBook.title}" updated successfully!`);
  };

  const handleBookDeleted = (deletedId: string): void => {
    const deletedBook = books.find(book => book._id === deletedId);
    setBooks(prev => prev.filter(book => book._id !== deletedId));
    setFilteredBooks(prev => prev.filter(book => book._id !== deletedId));
    if (deletedBook) {
      toast.success(`Book "${deletedBook.title}" deleted successfully!`);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>📚 Books Management System</h1>
        <nav className="nav-tabs">
          <button 
            className={activeTab === 'dashboard' ? 'active' : ''}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={activeTab === 'add-book' ? 'active' : ''}
            onClick={() => setActiveTab('add-book')}
          >
            Add Book
          </button>
        </nav>
      </header>

      <main className="main-content">
        {activeTab === 'dashboard' && (
          <>
            <Statistics books={books} />
            <SearchFilter onSearch={handleSearch} books={books} />
            <BookList 
              books={filteredBooks} 
              loading={loading}
              onBookUpdated={handleBookUpdated}
              onBookDeleted={handleBookDeleted}
            />
          </>
        )}

        {activeTab === 'add-book' && (
          <BookForm onBookAdded={handleBookAdded} />
        )}
      </main>

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
};

export default App;