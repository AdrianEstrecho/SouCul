@echo off
REM Run this AFTER restructure.bat to set up backend files

echo Creating backend configuration files...

REM Create composer.json
(
echo {
echo     "name": "soucul/backend",
echo     "description": "SouCul Backend API - Regional Filipino Souvenirs E-commerce",
echo     "type": "project",
echo     "license": "proprietary",
echo     "require": {
echo         "php": "^8.2",
echo         "vlucas/phpdotenv": "^5.6",
echo         "nikic/fast-route": "^1.3",
echo         "monolog/monolog": "^3.5"
echo     },
echo     "autoload": {
echo         "psr-4": {
echo             "SouCul\\": "src/"
echo         }
echo     },
echo     "scripts": {
echo         "start": "php -S localhost:8000 -t public"
echo     },
echo     "config": {
echo         "optimize-autoloader": true,
echo         "sort-packages": true
echo     }
echo }
) > backend\composer.json

REM Create .env.example
(
echo APP_NAME=SouCul API
echo APP_ENV=local
echo APP_DEBUG=true
echo APP_URL=http://localhost:8000
echo.
echo DB_CONNECTION=mysql
echo DB_HOST=127.0.0.1
echo DB_PORT=3307
echo DB_DATABASE=soucul
echo DB_USERNAME=soucul_dev
echo DB_PASSWORD=your_secure_password
echo.
echo JWT_SECRET=your_jwt_secret_key_here_change_in_production
echo JWT_EXPIRY=3600
echo.
echo CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
) > backend\.env.example

REM Create backend .gitignore
(
echo # Environment variables
echo .env
echo .env.local
echo .env.*.local
echo.
echo # Composer
echo /vendor/
echo composer.lock
echo.
echo # Logs
echo /storage/logs/*.log
echo.
echo # IDE
echo .vscode/
echo .idea/
echo.
echo # OS
echo .DS_Store
echo Thumbs.db
) > backend\.gitignore

REM Create backend README
(
echo # SouCul Backend API
echo.
echo PHP-based REST API for the SouCul e-commerce platform.
echo.
echo ## Setup
echo.
echo 1. Install dependencies:
echo    ```bash
echo    composer install
echo    ```
echo.
echo 2. Configure environment:
echo    ```bash
echo    cp .env.example .env
echo    ```
echo    Edit `.env` with your database credentials.
echo.
echo 3. Run development server:
echo    ```bash
echo    php -S localhost:8000 -t public
echo    ```
echo.
echo ## Documentation
echo.
echo See `/guides/BACKEND_GUIDE.md` in the project root for complete setup and API documentation.
) > backend\README.md

REM Create public/index.php placeholder
(
echo ^<?php
echo.
echo // Bootstrap file - Entry point for all API requests
echo echo json_encode^([
echo     'message' =^> 'SouCul API - Backend is ready for development',
echo     'version' =^> '1.0',
echo     'status' =^> 'development'
echo ]^);
) > backend\public\index.php

echo.
echo ✓ Backend files created successfully!
echo.
echo Next steps:
echo   1. cd backend
echo   2. copy .env.example .env
echo   3. Edit .env with your database credentials
echo   4. composer install
echo   5. php -S localhost:8000 -t public
echo.
pause
