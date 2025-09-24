import React, { useState } from 'react';
import { FaEdit, FaTrash, FaBook } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { Book, BookFormData } from '../types/Book';
import { bookService } from '../services/bookService';

interface BookListProps {
  books: Book[];
  loading: boolean;
  onBookUpdated: (book: Book) => void;
  onBookDeleted: (id: string) => void;
}

const BookList: React.FC<BookListProps> = ({ books, loading, onBookUpdated, onBookDeleted }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<BookFormData>({
    title: '',
    author: '',
    publishedYear: new Date().getFullYear()
  });

  const handleEdit = (book: Book): void => {
    setEditingId(book._id);
    setEditForm({
      title: book.title,
      author: book.author,
      publishedYear: book.publishedYear
    });
  };

  const handleUpdate = async (id: string): Promise<void> => {
    try {
      const updatedBook = await bookService.updateBook(id, editForm);
      onBookUpdated(updatedBook);
      setEditingId(null);
    } catch (error) {
      toast.error('Failed to update book');
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await bookService.deleteBook(id);
        onBookDeleted(id);
      } catch (error) {
        toast.error('Failed to delete book');
      }
    }
  };

  const handleCancel = (): void => {
    setEditingId(null);
    setEditForm({ title: '', author: '', publishedYear: new Date().getFullYear() });
  };

  if (loading) {
    return <div className="loading">Loading books...</div>;
  }

  if (books.length === 0) {
    return (
      <div className="no-books">
        <FaBook size={48} />
        <h3>No books found</h3>
        <p>Add some books to get started!</p>
      </div>
    );
  }

  return (
    <div className="books-grid">
      {books.map((book) => (
        <div key={book._id} className="book-card">
          {editingId === book._id ? (
            <div className="edit-form">
              <input
                type="text"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                placeholder="Title"
              />
              <input
                type="text"
                value={editForm.author}
                onChange={(e) => setEditForm({ ...editForm, author: e.target.value })}
                placeholder="Author"
              />
              <input
                type="number"
                value={editForm.publishedYear}
                onChange={(e) => setEditForm({ ...editForm, publishedYear: parseInt(e.target.value) })}
                placeholder="Year"
              />
              <div className="edit-actions">
                <button onClick={() => handleUpdate(book._id)} className="save-btn">
                  Save
                </button>
                <button onClick={handleCancel} className="cancel-btn">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="book-info">
                <h3>{book.title}</h3>
                <p className="author">by {book.author}</p>
                <p className="year">Published: {book.publishedYear}</p>
              </div>
              <div className="book-actions">
                <button onClick={() => handleEdit(book)} className="edit-btn">
                  <FaEdit />
                </button>
                <button onClick={() => handleDelete(book._id)} className="delete-btn">
                  <FaTrash />
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default BookList;