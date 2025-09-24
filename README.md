# 📚 Books API Management System

A comprehensive RESTful API server for managing books with a modern web interface, built using Express.js, MongoDB, and containerized with Docker.

## ✨ Features

### 🔧 Backend API
- **Complete CRUD Operations** - Create, Read, Update, Delete books
- **MongoDB Integration** - Mongoose ODM for database operations
- **RESTful Architecture** - Standard HTTP methods and status codes
- **Data Validation** - Input validation and error handling
- **Bulk Operations** - Support for single and multiple book operations
- **Comprehensive Test Suite** - Unit, integration, and API tests

### 🎨 Modern Frontend
- **Responsive Web Interface** - Modern, mobile-optimized design
- **Real-time Statistics Dashboard** - Live book statistics and analytics
- **Advanced Search & Filtering** - Filter by title, author, and publication year
- **Interactive Book Management** - Add, edit, delete books with visual feedback
- **Bulk Import/Export** - JSON file import/export functionality
- **Toast Notifications** - Real-time feedback with book details
- **Progressive Web App** - Mobile-friendly with custom favicon

### 🐳 Docker Support
- **Containerized Application** - Docker and Docker Compose setup
- **Multi-container Architecture** - Separate containers for app and database
- **Production Ready** - Optimized for deployment
- **Database Initialization** - Automatic MongoDB setup with sample data

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (or Docker for containerized setup)
- Git

### Option 1: Local Development
```bash
# Clone the repository
git clone https://github.com/Gautam-vidhate/node-js-and-mongoDB-project.git
cd node-js-and-mongoDB-project

# Install dependencies
npm install

# Start MongoDB (if running locally)
mongod

# Start the server
npm start
```

### Option 2: Docker (Recommended)
```bash
# Clone the repository
git clone https://github.com/Gautam-vidhate/node-js-and-mongoDB-project.git
cd node-js-and-mongoDB-project

# Start with Docker Compose
docker compose up -d

# View logs
docker compose logs -f
```

## 🌐 Access Points

- **API Base URL**: http://localhost:3000
- **Web Interface**: http://localhost:3000/public
- **MongoDB**: localhost:27017 (if using Docker)

## 📡 API Endpoints

### Books Management
| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| `GET` | `/books` | Get all books | - |
| `GET` | `/books/:id` | Get book by ID | - |
| `POST` | `/books` | Create book(s) | Single book or array |
| `PUT` | `/books/:id` | Update book | Partial book data |
| `DELETE` | `/books/:id` | Delete book | - |
| `DELETE` | `/books` | Delete all books | - |

### Request/Response Examples

#### Create Single Book
```json
POST /books
{
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "publishedYear": 1925
}
```

#### Create Multiple Books
```json
POST /books
[
  {
    "title": "1984",
    "author": "George Orwell",
    "publishedYear": 1949
  },
  {
    "title": "To Kill a Mockingbird",
    "author": "Harper Lee",
    "publishedYear": 1960
  }
]
```

#### Update Book
```json
PUT /books/:id
{
  "title": "Updated Title",
  "publishedYear": 2024
}
```

## 🎯 Web Interface Features

### Dashboard
- **Real-time Statistics** - Total books, unique authors, publication years
- **Search & Filter** - Multi-criteria filtering with live results
- **Book Grid View** - Visual card-based book display
- **Export Functionality** - Download books as JSON

### Book Management
- **Add Books** - Single book creation with validation
- **Edit Books** - In-place editing from book cards
- **Delete Books** - Individual or bulk deletion with confirmation
- **Bulk Operations** - JSON import, sample data loading

### User Experience
- **Toast Notifications** - Detailed success/error messages with book info
- **Responsive Design** - Mobile-optimized interface
- **Loading States** - Visual feedback for all operations
- **Form Validation** - Client-side validation with error messages

## 🧪 Testing

### Available Test Commands
```bash
# Run all tests
npm test

# Run with coverage report
npm run test:coverage

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration

# Run tests in watch mode
npm run test:watch
```

### Test Coverage
- **Unit Tests** (`book.test.js`) - Book model validation and methods
- **API Tests** (`server.test.js`) - All API endpoints functionality
- **Integration Tests** (`server.integration.test.js`) - End-to-end scenarios
- **Error Handling** - Invalid inputs and edge cases
- **Performance Tests** - Concurrent request handling
- **Database Tests** - MongoDB operations with in-memory database

## 🐳 Docker Deployment

### Docker Commands
```bash
# Build and start all services
docker compose up -d

# View real-time logs
docker compose logs -f

# Stop all services
docker compose down

# Rebuild and restart
docker compose up -d --build

# Individual container management
docker build -t books-api .
docker run -p 3000:3000 books-api
```

### Docker Architecture
- **Application Container** - Node.js app with optimized Alpine image
- **MongoDB Container** - Official MongoDB 7.0 with persistent storage
- **Network Isolation** - Custom Docker network for service communication
- **Volume Persistence** - Database data persisted across container restarts
- **Health Checks** - Container health monitoring
- **Security** - Non-root user, minimal attack surface

## 📁 Project Structure

```
├── 📄 Dockerfile                    # Docker container configuration
├── 📄 docker-compose.yml           # Multi-container orchestration
├── 📄 .dockerignore                # Docker build exclusions
├── 📄 mongo-init.js                # MongoDB initialization script
├── 📄 .gitignore                   # Git exclusions
├── 📄 package.json                 # Dependencies and scripts
├── 📄 package-lock.json            # Dependency lock file
├── 📄 README.md                    # Project documentation
│
├── 🔧 Backend Files
│   ├── 📄 server.js                # Server entry point
│   ├── 📄 app.js                   # Express app configuration
│   ├── 📄 book.js                  # Book model (Mongoose schema)
│   ├── 📄 jest.config.js           # Jest test configuration
│   └── 📄 jest.setup.js            # Jest setup file
│
├── 🧪 Test Files
│   ├── 📄 book.test.js             # Book model unit tests
│   ├── 📄 server.test.js           # API endpoint tests
│   └── 📄 server.integration.test.js # Integration tests
│
└── 🎨 Frontend Files
    └── 📁 public/
        ├── 📄 index.html           # Main web interface
        └── 📄 script.js            # Frontend JavaScript
```

## ⚙️ Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | `3000` | No |
| `MONGODB_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/booksdb` | No |
| `NODE_ENV` | Environment mode | `development` | No |

### Docker Environment
```yaml
# docker-compose.yml environment variables
MONGO_INITDB_ROOT_USERNAME: admin
MONGO_INITDB_ROOT_PASSWORD: password123
MONGO_INITDB_DATABASE: booksdb
MONGODB_URI: mongodb://admin:password123@mongodb:27017/booksdb?authSource=admin
```

## 🛠️ Technologies Used

### Backend Stack
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

### Frontend Stack
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with Grid/Flexbox
- **JavaScript (ES6+)** - Modern JavaScript features
- **Font Awesome** - Icon library
- **Responsive Design** - Mobile-first approach

### Development & Testing
- **Jest** - Testing framework
- **Supertest** - HTTP assertion library
- **MongoDB Memory Server** - In-memory MongoDB for testing

### DevOps & Deployment
- **Docker** - Containerization platform
- **Docker Compose** - Multi-container orchestration
- **Git** - Version control
- **GitHub** - Code repository and collaboration

## 📊 Performance Features

- **Efficient Database Queries** - Optimized MongoDB operations
- **Connection Pooling** - Mongoose connection management
- **Error Handling** - Comprehensive error catching and reporting
- **Input Validation** - Server-side and client-side validation
- **Concurrent Request Handling** - Express.js async operations
- **Memory Management** - Proper resource cleanup in tests

## 🔒 Security Features

- **Input Sanitization** - Mongoose schema validation
- **Error Message Sanitization** - No sensitive data exposure
- **Docker Security** - Non-root user, minimal base image
- **CORS Ready** - Cross-origin resource sharing support
- **Environment Variables** - Sensitive data protection

## 🚀 Deployment Options

### Local Development
```bash
npm install && npm start
```

### Docker Local
```bash
docker compose up -d
```

### Production Deployment
- **Cloud Platforms** - AWS, Google Cloud, Azure
- **Container Orchestration** - Kubernetes, Docker Swarm
- **Database Services** - MongoDB Atlas, AWS DocumentDB
- **CI/CD** - GitHub Actions, Jenkins, GitLab CI

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Gautam Vidhate**
- GitHub: [@Gautam-vidhate](https://github.com/Gautam-vidhate)
- Project: [Books API Management System](https://github.com/Gautam-vidhate/node-js-and-mongoDB-project)

## 🙏 Acknowledgments

- Express.js team for the excellent web framework
- MongoDB team for the powerful database
- Jest team for the comprehensive testing framework
- Docker team for containerization technology
- Font Awesome for the beautiful icons

---

⭐ **Star this repository if you found it helpful!**