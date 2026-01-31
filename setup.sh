#!/bin/bash

echo "╔════════════════════════════════════════╗"
echo "║  The Supply Store Backend Setup       ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js found: $(node --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✓ Dependencies installed successfully!"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Create data directory
echo ""
echo "📁 Creating data directory..."
mkdir -p data

echo ""
echo "╔════════════════════════════════════════╗"
echo "║  ✓ Setup Complete!                    ║"
echo "╠════════════════════════════════════════╣"
echo "║  Next steps:                           ║"
echo "║  1. Run: npm start                     ║"
echo "║  2. Open: http://localhost:3000        ║"
echo "║  3. Test: /api/health                  ║"
echo "╚════════════════════════════════════════╝"
