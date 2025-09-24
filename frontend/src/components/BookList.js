import React from 'react';
import { FaEdit, FaTrash, FaUser, FaCalendar, FaTag } from 'react-icons/fa';

const BookList = ({ books, loading, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="card">
        <h3>📚 Books Library</h3>
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          Loading books...
        </div>
      </div>
    );
  }

  if (!books || books.length === 0) {
    return (
      <div className="card">
        <h3>📚 Books Library</h3>
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          📖 No books found
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 style={{ marginBottom: '20px', color: '#2c3e50' }}>
        📚 Books Library ({books.length})
      </h3>
      
      <div className="grid">
        {books.map(book => (
          <div 
            key={book._id} 
            style={{
              border: '2px solid #e9ecef',
              borderRadius: '12px',
              padding: '20px',
              background: 'white',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-5px)';
              e.target.style.boxShadow = '0 15px 35px rgba(0,0,0,0.1)';
              e.target.style.borderColor = '#3498db';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
              e.target.style.borderColor = '#e9ecef';
            }}
          >
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '4px',
              height: '100%',
              background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)'
            }} />
            
            <h4 style={{
              color: '#2c3e50',
              marginBottom: '15px',
              fontSize: '1.3em',
              lineHeight: '1.4'
            }}>
              {book.title}
            </h4>
            
            <div style={{ marginBottom: '15px' }}>
              <p style={{
                marginBottom: '8px',
                color: '#6c757d',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <FaUser /> <strong>Author:</strong> {book.author || 'N/A'}
              </p>
              <p style={{
                marginBottom: '8px',
                color: '#6c757d',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <FaCalendar /> <strong>Year:</strong> {book.publishedYear || 'N/A'}
              </p>
              <p style={{
                marginBottom: '8px',
                color: '#6c757d',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <FaTag /> <strong>ID:</strong> {book._id}
              </p>
            </div>
            
            <div style={{
              display: 'flex',
              gap: '10px',
              marginTop: '20px'
            }}>
              <button
                className="btn btn-success"
                onClick={() => onEdit(book)}
                style={{ flex: 1, padding: '8px 12px', fontSize: '12px' }}
              >
                <FaEdit /> Edit
              </button>
              <button
                className="btn btn-danger"
                onClick={() => onDelete(book._id)}
                style={{ flex: 1, padding: '8px 12px', fontSize: '12px' }}
              >
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookList;