// MongoDB initialization script
db = db.getSiblingDB('booksdb');

// Create a user for the books database
db.createUser({
  user: 'booksuser',
  pwd: 'bookspass',
  roles: [
    {
      role: 'readWrite',
      db: 'booksdb'
    }
  ]
});

// Insert sample data
db.books.insertMany([
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    publishedYear: 1925
  },
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    publishedYear: 1960
  },
  {
    title: '1984',
    author: 'George Orwell',
    publishedYear: 1949
  }
]);

print('Database initialized with sample data');