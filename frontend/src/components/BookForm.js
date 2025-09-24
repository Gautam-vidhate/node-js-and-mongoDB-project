import React, { useState, useEffect } from 'react';
import { FaPlus, FaSave, FaTimes } from 'react-icons/fa';

const BookForm = ({ onSubmit, initialData, isEditing, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    publishedYear: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        author: initialData.author || '',
        publishedYear: initialData.publishedYear || ''
      });
    } else {
      setFormData({
        title: '',
        author: '',
        publishedYear: ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Title is required');
      return;
    }

    const bookData = {
      title: formData.title.trim()
    };

    if (formData.author.trim()) {
      bookData.author = formData.author.trim();
    }

    if (formData.publishedYear) {
      bookData.publishedYear = parseInt(formData.publishedYear);
    }

    onSubmit(bookData);
    
    if (!isEditing) {
      setFormData({
        title: '',
        author: '',
        publishedYear: ''
      });
    }
  };

  return (
    <div className="card">
      <h3 style={{ marginBottom: '20px', color: '#2c3e50' }}>
        {isEditing ? (
          <>
            <FaSave style={{ marginRight: '10px' }} />
            Update Book
          </>
        ) : (
          <>
            <FaPlus style={{ marginRight: '10px' }} />
            Add New Book
          </>
        )}
      </h3>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: '600',
            color: '#495057'
          }}>
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter book title"
            required
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: '600',
            color: '#495057'
          }}>
            Author
          </label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter author name"
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: '600',
            color: '#495057'
          }}>
            Published Year
          </label>
          <input
            type="number"
            name="publishedYear"
            value={formData.publishedYear}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter year"
            min="1000"
            max="2030"
          />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
            {isEditing ? (
              <>
                <FaSave /> Update Book
              </>
            ) : (
              <>
                <FaPlus /> Add Book
              </>
            )}
          </button>
          
          {isEditing && (
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={onCancel}
              style={{ 
                background: '#6c757d',
                color: 'white'
              }}
            >
              <FaTimes /> Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default BookForm;