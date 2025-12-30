@echo off
echo ========================================
echo Bowen Accounting Department Portal
echo Installation Script
echo ========================================
echo.

echo [1/4] Checking prerequisites...
echo.

:: Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] Node.js is installed

:: Check Go
go version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Go is not installed!
    echo Please install Go from https://go.dev/dl/
    pause
    exit /b 1
)
echo [OK] Go is installed

:: Check MongoDB
mongod --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] MongoDB is not installed or not in PATH
    echo Please install MongoDB from https://www.mongodb.com/try/download/community
    echo Or use MongoDB Atlas (cloud)
)
echo.

echo [2/4] Installing frontend dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install frontend dependencies
    pause
    exit /b 1
)
echo [OK] Frontend dependencies installed
cd ..
echo.

echo [3/4] Installing backend dependencies...
cd backend
call go mod download
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install backend dependencies
    pause
    exit /b 1
)
echo [OK] Backend dependencies installed
cd ..
echo.

echo [4/4] Setup complete!
echo.
echo ========================================
echo Next Steps:
echo ========================================
echo.
echo 1. Start MongoDB:
echo    mongod
echo.
echo 2. Start Backend (in new terminal):
echo    cd backend
echo    go run main.go
echo.
echo 3. Start Frontend (in new terminal):
echo    cd frontend
echo    npm run dev
echo.
echo 4. Open browser:
echo    http://localhost:3000
echo.
echo ========================================
echo For detailed instructions, see:
echo - QUICKSTART.md
echo - README.md
echo ========================================
echo.
pause
