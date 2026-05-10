#!/bin/bash

# LyricDash Installation Script
# Automatic setup untuk development environment

echo "========================================="
echo "  LyricDash Setup Script"
echo "  Multiplayer Typing Game & Chatroom"
echo "========================================="
echo ""

# Check Node.js installation
echo "📋 Checking prerequisites..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "   Please install Node.js from https://nodejs.org/"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    echo "   npm should come with Node.js"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    cd ..
    exit 1
fi

echo "✅ Backend dependencies installed"
cd ..
echo ""

# Create .env file if not exists
if [ ! -f "backend/.env" ]; then
    echo "⚙️  Creating .env file..."
    cat > backend/.env << EOF
PORT=3000
NODE_ENV=development
JWT_SECRET=dev-secret-key-change-in-production
EOF
    echo "✅ .env file created (backend/.env)"
    echo "   ⚠️  Remember to change JWT_SECRET in production!"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "========================================="
echo "  ✅ Setup Complete!"
echo "========================================="
echo ""
echo "🚀 To start the application:"
echo ""
echo "   cd backend"
echo "   npm start"
echo ""
echo "   Or for development with auto-reload:"
echo "   npm run dev"
echo ""
echo "📖 Then open http://localhost:3000 in your browser"
echo ""
echo "📚 Documentation:"
echo "   - Quick Start: see QUICKSTART.md"
echo "   - Full Docs: see README.md"
echo "   - API Testing: see API_TESTING.md"
echo "   - Deployment: see DEPLOYMENT.md"
echo ""
