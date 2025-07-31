#!/bin/bash

# Local Frontend Development Script (Client Directory)
echo "🚀 Starting Book Club Frontend in Local Development Mode..."

# Check if we're in the correct directory (should have package.json)
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Make sure you're in the Client directory."
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Load local environment variables from parent directory
if [ -f "../.env.local" ]; then
    echo "📝 Loading local environment variables from ../.env.local"
    export $(grep -v '^#' ../.env.local | xargs)
else
    echo "⚠️  Warning: ../.env.local not found. Using default local environment..."
    # Set default environment variables
    export VITE_API_BASE_URL=http://localhost:8000/api
    export VITE_BACKEND_URL=http://localhost:8000
    export VITE_WS_URL=ws://localhost:8000/ws
    export NODE_ENV=development
    export VITE_NODE_ENV=development
    export VITE_DEBUG=true
fi

# Check if there's a local .env file in Client directory and load it too
if [ -f ".env" ]; then
    echo "📝 Loading additional environment variables from .env"
    export $(grep -v '^#' .env | xargs)
fi

echo "🌐 Frontend will be available at: http://localhost:5173"
echo "🔗 Backend API expected at: $VITE_API_BASE_URL"
echo "💡 Press Ctrl+C to stop the development server"
echo ""

# Start the development server
npm run dev
