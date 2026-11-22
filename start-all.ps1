# ArogyaTrack One-Click PowerShell Launcher
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host " Starting ArogyaTrack Healthcare Platform" -ForegroundColor Green
Write-Host " Track Health. Connect Care. Stay Well." -ForegroundColor White
Write-Host "===================================================" -ForegroundColor Cyan

$baseDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# 1. MySQL
Write-Host "[1/4] Starting MySQL Database on port 3306..." -ForegroundColor Yellow
Start-Process "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqld.exe" -ArgumentList '--defaults-file="C:\Users\ashya\.mysql_data\my.ini" --console' -WindowStyle Minimized
Start-Sleep -Seconds 3

# 2. Python ML Service
Write-Host "[2/4] Starting Python ML Service on port 5000..." -ForegroundColor Yellow
$mlCmd = "`$env:PATH = '$env:LOCALAPPDATA\Programs\Python\Python311;$env:LOCALAPPDATA\Programs\Python\Python311\Scripts;' + `$env:PATH; cd '$baseDir\ml-service'; python app.py"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $mlCmd

Start-Sleep -Seconds 3

# 3. Spring Boot Backend
Write-Host "[3/4] Starting Spring Boot Backend on port 8080..." -ForegroundColor Yellow
$backendCmd = "`$env:PATH = '$env:LOCALAPPDATA\Programs\apache-maven-3.9.6\bin;' + `$env:PATH; cd '$baseDir\backend'; mvn spring-boot:run"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCmd

Start-Sleep -Seconds 8

# 4. React Frontend
Write-Host "[4/4] Starting React Frontend on port 5173..." -ForegroundColor Yellow
$frontendCmd = "cd '$baseDir\frontend'; npm run dev"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendCmd

Write-Host "===================================================" -ForegroundColor Green
Write-Host " All services started successfully!" -ForegroundColor Green
Write-Host " Frontend: http://localhost:5173" -ForegroundColor White
Write-Host " Backend:  http://localhost:8080" -ForegroundColor White
Write-Host " ML API:   http://localhost:5000" -ForegroundColor White
Write-Host "===================================================" -ForegroundColor Green
