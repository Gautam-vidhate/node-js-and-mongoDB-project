@echo off
echo 🛑 Stopping Books API container...

docker stop books-api
docker rm books-api

echo ✅ Container stopped and removed!
pause