#!/bin/bash

# AI Receptionist - Quick Start Script
# This script helps you get started quickly

echo "🤖 AI Receptionist - Quick Start"
echo "================================"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local file not found!"
    echo ""
    echo "Creating .env.local from template..."
    cp .env.example .env.local
    echo "✅ Created .env.local"
    echo ""
    echo "📝 Please edit .env.local and add your API keys:"
    echo "   - GEMINI_API_KEY (from https://makersuite.google.com/app/apikey)"
    echo "   - OPENAI_API_KEY (from https://platform.openai.com/api-keys)"
    echo ""
    read -p "Press Enter when you've added your API keys..."
fi

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
    echo ""
fi

# Verify API keys are set
if ! grep -q "GEMINI_API_KEY=AIza" .env.local && ! grep -q "GEMINI_API_KEY=your" .env.local; then
    echo "⚠️  Warning: GEMINI_API_KEY might not be set correctly"
fi

if ! grep -q "OPENAI_API_KEY=sk-" .env.local && ! grep -q "OPENAI_API_KEY=your" .env.local; then
    echo "⚠️  Warning: OPENAI_API_KEY might not be set correctly"
fi

echo "🚀 Starting development server..."
echo ""
echo "🌐 Open http://localhost:3000 in your browser"
echo ""
echo "💡 Tips:"
echo "   - Click the microphone button to start"
echo "   - Say: 'I want to talk to Rahul from engineering'"
echo "   - Watch the AI route your call!"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev
