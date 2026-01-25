#!/bin/bash

set -e

echo "🚀 Deploying AI for Coders to Vercel..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  Warning: .env.local not found. Creating from template..."
    cp .env.example .env.local
    echo "📝 Please edit .env.local with your environment variables and run this script again."
    exit 1
fi

# Make scripts executable
chmod +x scripts/*.sh

echo "📋 Pre-deployment checks..."
echo "✅ package.json found"
echo "✅ .env.local found"

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Type check
echo "🔍 Running TypeScript type check..."
pnpm typecheck

# Lint code
echo "🔍 Running ESLint..."
pnpm lint

# Build the project
echo "🔨 Building project..."
pnpm build

echo ""
echo "✅ Build completed successfully!"
echo ""

# Check if vercel is logged in
if ! vercel whoami > /dev/null 2>&1; then
    echo "🔐 Please login to Vercel first..."
    vercel login
fi

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
if [ "$1" == "--prod" ] || [ "$1" == "-p" ]; then
    echo "🚀 Deploying to production..."
    vercel --prod
else
    echo "🌍 Deploying to preview..."
    vercel
fi

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🔗 Your app is now live!"
echo "📊 Check deployment status at: https://vercel.com/dashboard"
echo "🔧 View logs at: https://vercel.com/dashboard/functions"