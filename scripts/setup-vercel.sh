#!/bin/bash

echo "🚀 Setting up Vercel deployment for AI for Coders..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Install Vercel CLI if not installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Login to Vercel (if not already logged in)
echo "🔐 Please login to Vercel (if not already logged in)..."
vercel login

# Link to Vercel project (creates vercel.json if not exists)
echo "🔗 Linking to Vercel project..."
vercel link

# Pull environment variables
echo "🔑 Pulling environment variables..."
if [ -f ".env.local" ]; then
    echo "⚠️  .env.local already exists. Creating .env.local.backup..."
    cp .env.local .env.local.backup
fi
vercel env pull .env.local

echo ""
echo "✅ Vercel setup complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Review and update .env.local with your actual API keys"
echo "   2. Set required environment variables in Vercel dashboard:"
echo "      - GEMINI_API_KEY (required)"
echo "      - JWT_SECRET (minimum 32 characters)"
echo "      - SECRET_KEY (minimum 32 characters)"
echo "   3. Deploy using: ./scripts/deploy.sh"
echo ""
echo "🔗 Vercel Project: https://vercel.com/dashboard"