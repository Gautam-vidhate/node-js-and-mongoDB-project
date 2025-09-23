@echo off

echo 🐳 Building Books API Docker Images...

REM Build the main application image
echo 📦 Building production image...
docker build -t books-api:latest .

REM Build the development image
echo 📦 Building development image...
docker build -f Dockerfile.dev -t books-api:dev .

echo ✅ Docker images built successfully!

REM Show built images
echo 📋 Available images:
docker images | findstr books-api

echo.
echo 🚀 To run the application:
echo Production: docker-compose up -d
echo Development: docker-compose -f docker-compose.dev.yml up -d

pause