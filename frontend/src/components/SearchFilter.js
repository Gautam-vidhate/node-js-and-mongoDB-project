import React, { useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';

const SearchFilter = ({ onFilter, books }) => {
  const [filters, setFilters] = useState({
    title: '',
    author: '',
    year: ''
  });

  const years = [...new Set(books.filter(book => book.publishedYear).map(book => book.publishedYear))].sort((a, b) => b - a);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = {
      ...filters,
      [name]: value
    };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {
      title: '',
      author: '',
      year: ''
    };
    setFilters(emptyFilters);
    onFilter(emptyFilters);
  };

  return (
    <div className="card" style={{ marginBottom: '25px' }}>
      <h4 style={{ marginBottom: '15px', color: '#2c3e50' }}>
        <FaSearch style={{ marginRight: '10px' }} />
        Search & Filter Books
      </h4>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px',
        alignItems: 'end'
      }}>
        <div>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: '600',
            color: '#495057',
            fontSize: '0.9em'
          }}>
            Search by Title
          </label>
          <input
            type="text"
            name="title"
            value={filters.title}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter title to search..."
          />
        </div>

        <div>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: '600',
            color: '#495057',
            fontSize: '0.9em'
          }}>
            Search by Author
          </label>
          <input
            type="text"
            name="author"
            value={filters.author}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter author to search..."
          />
        </div>

        <div>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: '600',
            color: '#495057',
            fontSize: '0.9em'
          }}>
            Filter by Year
          </label>
          <select
            name="year"
            value={filters.year}
            onChange={handleChange}
            className="form-control"
          >
            <option value="">All Years</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <div>
          <button
            onClick={clearFilters}
            className="btn btn-warning"
            style={{ width: '100%' }}
          >
            <FaTimes /> Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;