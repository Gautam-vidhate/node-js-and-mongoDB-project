#!/bin/bash

# Build and run Books API with Docker

echo "🐳 Building Books API Docker Images..."

# Build the main application image
echo "📦 Building production image..."
docker build -t books-api:latest .

# Build the development image
echo "📦 Building development image..."
docker build -f Dockerfile.dev -t books-api:dev .

echo "✅ Docker images built successfully!"

# Show built images
echo "📋 Available images:"
docker images | grep books-api

echo ""
echo "🚀 To run the application:"
echo "Production: docker-compose up -d"
echo "Development: docker-compose -f docker-compose.dev.yml up -d"