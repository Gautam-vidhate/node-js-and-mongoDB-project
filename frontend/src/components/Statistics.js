import React from 'react';
import { FaBook, FaUserEdit, FaCalendar, FaHistory } from 'react-icons/fa';

const Statistics = ({ books }) => {
  const totalBooks = books.length;
  const uniqueAuthors = new Set(books.filter(book => book.author).map(book => book.author)).size;
  const years = books.filter(book => book.publishedYear).map(book => book.publishedYear);
  const latestYear = years.length > 0 ? Math.max(...years) : '-';
  const oldestYear = years.length > 0 ? Math.min(...years) : '-';

  const StatCard = ({ icon, title, value, color }) => (
    <div style={{
      background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
      color: 'white',
      padding: '25px',
      borderRadius: '12px',
      textAlign: 'center',
      boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
    }}>
      <div style={{ fontSize: '2.5em', marginBottom: '15px', opacity: 0.8 }}>
        {icon}
      </div>
      <h3 style={{ fontSize: '2em', marginBottom: '5px' }}>
        {value}
      </h3>
      <p style={{ opacity: 0.9, fontSize: '0.9em' }}>
        {title}
      </p>
    </div>
  );

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px',
      marginBottom: '30px'
    }}>
      <StatCard
        icon={<FaBook />}
        title="Total Books"
        value={totalBooks}
        color="#667eea"
      />
      <StatCard
        icon={<FaUserEdit />}
        title="Unique Authors"
        value={uniqueAuthors}
        color="#764ba2"
      />
      <StatCard
        icon={<FaCalendar />}
        title="Latest Publication"
        value={latestYear}
        color="#27ae60"
      />
      <StatCard
        icon={<FaHistory />}
        title="Oldest Publication"
        value={oldestYear}
        color="#e74c3c"
      />
    </div>
  );
};

export default Statistics;