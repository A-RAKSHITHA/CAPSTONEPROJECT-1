@echo off
title ArogyaTrack - Full Stack Launcher
echo ===================================================
echo Starting ArogyaTrack Healthcare Platform
echo Tagline: Track Health. Connect Care. Stay Well.
echo ===================================================

echo [1/4] Starting MySQL Database...
start "ArogyaTrack - MySQL" /min "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqld.exe" --defaults-file="C:\Users\ashya\.mysql_data\my.ini" --console
timeout /t 3 /nobreak >nul

echo [2/4] Starting Python ML Microservice (Port 5000)...
start "ArogyaTrack - ML Service" powershell -NoExit -Command "$env:PATH = '%LOCALAPPDATA%\Programs\Python\Python311;%LOCALAPPDATA%\Programs\Python\Python311\Scripts;' + $env:PATH; cd ml-service; python app.py"
timeout /t 3 /nobreak >nul

echo [3/4] Starting Spring Boot Backend (Port 8080)...
start "ArogyaTrack - Backend" powershell -NoExit -Command "$env:PATH = '%LOCALAPPDATA%\Programs\apache-maven-3.9.6\bin;' + $env:PATH; cd backend; mvn spring-boot:run"
timeout /t 8 /nobreak >nul

echo [4/4] Starting React Frontend (Port 5173)...
start "ArogyaTrack - Frontend" powershell -NoExit -Command "cd frontend; npm run dev"

echo.
echo ===================================================
echo ArogyaTrack is launching!
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:8080
echo ML API:   http://localhost:5000
echo ===================================================
pause
