# 🐳 Docker Setup for Books API

## Quick Start

### Option 1: Using Docker Compose (Recommended)

**Production Environment:**
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

**Development Environment:**
```bash
# Start development environment with hot reload
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop services
docker-compose -f docker-compose.dev.yml down
```

### Option 2: Using NPM Scripts

```bash
# Build Docker image
npm run docker:build

# Run with Docker Compose
npm run docker:up

# View logs
npm run docker:logs

# Stop containers
npm run docker:down
```

### Option 3: Manual Docker Commands

```bash
# Build the image
docker build -t books-api:latest .

# Run MongoDB
docker run -d --name books-mongodb -p 27017:27017 mongo:7.0

# Run Books API
docker run -d --name books-api -p 3000:3000 --link books-mongodb:mongodb books-api:latest
```

## 🌐 Access Your Application

- **Frontend:** http://localhost:3000
- **API:** http://localhost:3000/books
- **MongoDB:** localhost:27017

## 📁 Docker Files Overview

- `Dockerfile` - Production image
- `Dockerfile.dev` - Development image with hot reload
- `docker-compose.yml` - Production environment
- `docker-compose.dev.yml` - Development environment
- `.dockerignore` - Files to exclude from Docker build
- `mongo-init.js` - MongoDB initialization script
- `healthcheck.js` - Container health check

## 🔧 Environment Variables

### Production (docker-compose.yml)
- `NODE_ENV=production`
- `PORT=3000`
- `MONGODB_URI=mongodb://admin:password123@mongodb:27017/booksdb?authSource=admin`

### Development (docker-compose.dev.yml)
- `NODE_ENV=development`
- `PORT=3001`
- `MONGODB_URI=mongodb://mongodb-dev:27017/booksdb_dev`

## 📊 Container Management

```bash
# View running containers
docker ps

# View all containers
docker ps -a

# View images
docker images

# Remove containers
docker rm books-api books-mongodb

# Remove images
docker rmi books-api:latest

# Clean up everything
docker system prune -a
```

## 🔍 Troubleshooting

### Check container logs:
```bash
docker logs books-api
docker logs books-mongodb
```

### Access container shell:
```bash
docker exec -it books-api sh
docker exec -it books-mongodb mongosh
```

### Rebuild containers:
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## 🚀 Production Deployment

For production deployment, use the production docker-compose:

```bash
# Pull latest images
docker-compose pull

# Start in production mode
docker-compose up -d

# Monitor
docker-compose logs -f
```

## 📝 Sample Data

The MongoDB container automatically initializes with sample books:
- The Great Gatsby (1925)
- To Kill a Mockingbird (1960)
- 1984 (1949)