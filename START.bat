@echo off
echo ========================================
echo Bowen Accounting Department Portal
echo Starting Application
echo ========================================
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend && go run main.go"
timeout /t 3 >nul

echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd frontend && npm run dev"
timeout /t 3 >nul

echo.
echo ========================================
echo Application is starting...
echo ========================================
echo.
echo Backend:  http://localhost:8080
echo Frontend: http://localhost:3000
echo.
echo Two terminal windows have been opened.
echo Wait a few seconds for servers to start.
echo.
echo Press any key to open the application in browser...
pause >nul

start http://localhost:3000

echo.
echo Application opened in browser!
echo.
echo To stop the servers, close the terminal windows.
echo.
