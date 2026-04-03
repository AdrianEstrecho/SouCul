@echo off
cd /d "%~dp0"
echo Installing required packages...
call npm install mysql2 dotenv
echo.
echo ====================================
echo Running database diagnostic...
echo ====================================
node diagnose-db.js
echo.
pause
