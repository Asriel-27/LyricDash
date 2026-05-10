@echo off
REM LyricDash Installation Script untuk Windows
REM Automatic setup untuk development environment

cls
echo =========================================
echo   LyricDash Setup Script
echo   Multiplayer Typing Game ^& Chatroom
echo =========================================
echo.

REM Check Node.js installation
echo 📋 Checking prerequisites...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed
    echo    Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm is not installed
    echo    npm should come with Node.js
    pause
    exit /b 1
)

echo ✅ Node.js and npm are installed
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo    Node.js version: %NODE_VERSION%
echo    npm version: %NPM_VERSION%
echo.

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd backend
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install dependencies
    cd ..
    pause
    exit /b 1
)

echo ✅ Backend dependencies installed
cd ..
echo.

REM Create .env file if not exists
if not exist "backend\.env" (
    echo ⚙️  Creating .env file...
    (
        echo PORT=3000
        echo NODE_ENV=development
        echo JWT_SECRET=dev-secret-key-change-in-production
    ) > backend\.env
    echo ✅ .env file created (backend\.env)
    echo    ⚠️  Remember to change JWT_SECRET in production!
) else (
    echo ✅ .env file already exists
)

echo.
echo =========================================
echo   ✅ Setup Complete!
echo =========================================
echo.
echo 🚀 To start the application:
echo.
echo    cd backend
echo    npm start
echo.
echo    Or for development with auto-reload:
echo    npm run dev
echo.
echo    📖 Then open http://localhost:3000 in your browser
echo.
echo 📚 Documentation:
echo    - Quick Start: see QUICKSTART.md
echo    - Full Docs: see README.md
echo    - API Testing: see API_TESTING.md
echo    - Deployment: see DEPLOYMENT.md
echo.
pause
