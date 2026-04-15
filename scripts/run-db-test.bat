REM Estrecho, Adrian M.
REM Mansilla, Rhangel R.
REM Romualdo, Jervin Paul C.
REM Sostea, Joana Marie A.
REM Torres, Ceazarion Sean Nicholas M.
REM Tupaen, Arianne Kaye E.
REM
REM BSIT/IT22S1

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
