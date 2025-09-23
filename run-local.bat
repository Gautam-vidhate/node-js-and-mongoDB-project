@echo off
echo 🚀 Starting Books API with Local MongoDB...

echo 📦 Building Docker image...
docker build -t books-api:latest .

if %errorlevel% neq 0 (
    echo ❌ Docker build failed!
    pause
    exit /b 1
)

echo 🐳 Running Books API container...
docker run -d --name books-api -p 3000:3000 -e MONGODB_URI=mongodb://host.docker.internal:27017/booksdb --add-host host.docker.internal:host-gateway books-api:latest

if %errorlevel% neq 0 (
    echo ❌ Failed to start container!
    pause
    exit /b 1
)

echo ✅ Books API is running!
echo 🌐 Access your app at: http://localhost:3000
echo 📊 API endpoints at: http://localhost:3000/books

echo.
echo 📋 Container management:
echo   View logs: docker logs books-api
echo   Stop: docker stop books-api
echo   Remove: docker rm books-api

pause