#!/bin/bash

# Local Frontend Development Script
echo "🚀 Starting Book Club Frontend in Local Development Mode..."

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Make sure you're in the frontend root directory."
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Load local environment variables
if [ -f ".env.local" ]; then
    echo "📝 Loading local environment variables from .env.local"
    export $(grep -v '^#' .env.local | xargs)
else
    echo "⚠️  Warning: .env.local not found. Creating default local environment..."
    cat > .env.local << 'EOF'
VITE_API_BASE_URL=http://localhost:8000/api
VITE_BACKEND_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000/ws
NODE_ENV=development
VITE_NODE_ENV=development
VITE_DEBUG=true
EOF
    export $(grep -v '^#' .env.local | xargs)
fi

# Change to Client directory if it exists
if [ -d "Client" ]; then
    echo "📁 Switching to Client directory..."
    cd Client
fi

echo "🌐 Frontend will be available at: http://localhost:5173"
echo "🔗 Backend API expected at: $VITE_API_BASE_URL"
echo "💡 Press Ctrl+C to stop the development server"
echo ""

# Start the development server
npm run dev
