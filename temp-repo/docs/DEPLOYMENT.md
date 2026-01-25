# Deployment Guide

This guide covers deploying the AI for Coders application to Vercel with all the necessary configurations and steps.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Configuration](#environment-configuration)
- [Vercel Setup](#vercel-setup)
- [Deployment Steps](#deployment-steps)
- [Environment Variables](#environment-variables)
- [Domain Configuration](#domain-configuration)
- [Monitoring and Logs](#monitoring-and-logs)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Accounts

1. **GitHub Account** - For repository hosting
2. **Vercel Account** - For deployment ([Sign up here](https://vercel.com/signup))
3. **Google Gemini API Key** - Get from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Required Software

- **Git** for version control
- **Node.js** 18+ for local development
- **Vercel CLI** (optional, for command-line deployment):
  ```bash
  npm install -g vercel
  ```

## Environment Configuration

### 1. Environment Files

Create the following environment template files:

#### `.env.example`
```bash
# Environment Configuration Template
NODE_ENV=development
API_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production
SECRET_KEY=your-encryption-secret-key-change-in-production

# Google Gemini AI
GEMINI_API_KEY=your-gemini-api-key-here

# Optional Database
DATABASE_URL=postgresql://username:password@localhost:5432/ai_for_coders

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:4200

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

# Encryption
ENCRYPTION_KEY=your-encryption-key-must-be-32-characters
ENCRYPTION_IV=your-iv-must-be-16-characters
```

#### `.env.local.example`
```bash
# Copy this to .env.local for local development
# Fill in your actual values

NODE_ENV=development
GEMINI_API_KEY=your-local-gemini-api-key
JWT_SECRET=dev-jwt-secret
SECRET_KEY=dev-secret-key
API_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000
```

#### `.env.production.example`
```bash
# Production environment template
NODE_ENV=production
GEMINI_API_KEY=your-production-gemini-api-key
JWT_SECRET=production-jwt-secret-minimum-32-chars
SECRET_KEY=production-secret-key-minimum-32-chars
API_URL=https://api.aiforcoders.vercel.app
NEXT_PUBLIC_API_URL=https://aiforcoders.vercel.app
ALLOWED_ORIGINS=https://aiforcoders.vercel.app,https://*.vercel.app
```

### 2. Google Gemini API Setup

1. **Get API Key:**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Click "Create API Key"
   - Copy the generated key (starts with `AIza`)

2. **Set Quotas and Billing:**
   - Visit [Google Cloud Console](https://console.cloud.google.com/)
   - Enable billing for your project
   - Set up usage quotas as needed

3. **API Usage Limits:**
   - Free tier: 60 requests per minute
   - Paid tier: Higher limits based on your plan
   - Monitor usage in Google Cloud Console

## Vercel Setup

### 1. Connect GitHub Repository

1. **Login to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with your GitHub account

2. **Import Project:**
   - Click "New Project"
   - Find your repository: `SudheendraSripada/ai-for-coders-web`
   - Click "Import"

### 2. Project Configuration

#### Framework Preset
- Select **"Next.js"** as the framework (even though we use Vite, this provides better Vercel integration)

#### Build Settings

```
Build Command: pnpm run build
Output Directory: apps/web/dist (for web app)
Install Command: pnpm install
Development Command: pnpm run dev
```

#### Root Directory
Set the root directory to the repository root (`.`)

### 3. Environment Variables

Add the following environment variables in the Vercel dashboard:

#### Production Environment

| Variable | Value | Description |
|----------|-------|-------------|
| `NODE_ENV` | `production` | Environment mode |
| `GEMINI_API_KEY` | Your Gemini API key | Required for AI functionality |
| `JWT_SECRET` | Your JWT secret | Minimum 32 characters |
| `SECRET_KEY` | Your encryption secret | Minimum 32 characters |
| `NEXT_PUBLIC_API_URL` | `https://api.aiforcoders.vercel.app` | API endpoint URL |
| `API_URL` | `https://api.aiforcoders.vercel.app` | Internal API URL |

#### Preview Environment (for PRs)

| Variable | Value | Description |
|----------|-------|-------------|
| `NODE_ENV` | `preview` | Preview environment mode |
| `GEMINI_API_KEY` | Same as production | API key for testing |
| `JWT_SECRET` | Different from production | Separate secret for previews |
| `SECRET_KEY` | Different from production | Separate encryption key |
| `NEXT_PUBLIC_API_URL` | Vercel preview URL | Auto-generated per PR |

### 4. Build Configuration

Vercel will automatically use the `vercel.json` configuration:

```json
{
  "version": 2,
  "buildCommand": "pnpm run build",
  "devCommand": "pnpm run dev",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "env": {
    "NODE_ENV": {
      "value": "production",
      "description": "Node environment",
      "required": false
    },
    "NEXT_PUBLIC_API_URL": {
      "value": "https://api.aiforcoders.vercel.app",
      "description": "Frontend API URL",
      "required": true
    },
    "GEMINI_API_KEY": {
      "value": "",
      "description": "Google Gemini API key",
      "required": true
    },
    "SECRET_KEY": {
      "value": "",
      "description": "JWT secret key",
      "required": true
    }
  }
}
```

## Deployment Steps

### Method 1: Automatic Deployment (Recommended)

1. **Connect Repository:**
   - Connect your GitHub repository to Vercel
   - Enable automatic deployments on push to main branch

2. **Deploy:**
   - Vercel will automatically:
     - Install dependencies
     - Build the project
     - Deploy to production
     - Provide a preview URL

3. **Monitor:**
   - Check deployment status in Vercel dashboard
   - Monitor build logs for any errors

### Method 2: Manual Deployment

#### Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel

# Deploy to production
vercel --prod
```

#### Using GitHub Actions

The project includes `.github/workflows/deploy.yml` for automatic deployment:

```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
      - name: Install dependencies
        run: pnpm install
      - name: Build project
        run: pnpm build
        env:
          GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
          JWT_SECRET: ${{ secrets.JWT_SECRET }}
          SECRET_KEY: ${{ secrets.SECRET_KEY }}
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

### Method 3: Using Scripts

Use the provided deployment scripts:

```bash
# Make script executable
chmod +x scripts/deploy.sh

# Run deployment script
./scripts/deploy.sh
```

#### Setup Script (`scripts/setup-vercel.sh`)

```bash
#!/bin/bash

echo "🚀 Setting up Vercel deployment for AI for Coders..."

# Install Vercel CLI if not installed
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi

# Login to Vercel (if not already logged in)
echo "Please login to Vercel (if not already logged in)..."
vercel login

# Link to Vercel project (creates vercel.json if not exists)
echo "Linking to Vercel project..."
vercel link

# Pull environment variables
echo "Pulling environment variables..."
vercel env pull .env.local

echo "✅ Vercel setup complete!"
echo "📝 Don't forget to:"
echo "   1. Set your GEMINI_API_KEY in Vercel dashboard"
echo "   2. Set JWT_SECRET and SECRET_KEY in Vercel dashboard"
echo "   3. Deploy using: vercel --prod"
```

#### Deployment Script (`scripts/deploy.sh`)

```bash
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

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Build the project
echo "🔨 Building project..."
pnpm build

# Run tests (if any)
echo "🧪 Running tests..."
pnpm test || echo "⚠️  Some tests failed, but continuing deployment..."

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "🔗 Your app is now live at the provided URL"
```

## Environment Variables

### Required Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `GEMINI_API_KEY` | Google Gemini AI integration | `AIzaSy...` |
| `JWT_SECRET` | JWT token signing (min 32 chars) | `your-super-secret-jwt-key-minimum-32-chars` |
| `SECRET_KEY` | Encryption key (min 32 chars) | `your-encryption-secret-key-minimum-32-chars` |

### Optional Variables

| Variable | Purpose | Default |
|----------|---------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `API_URL` | API base URL | `https://api.aiforcoders.vercel.app` |
| `NEXT_PUBLIC_API_URL` | Public API URL | `https://aiforcoders.vercel.app` |
| `DATABASE_URL` | Database connection | Not required |
| `ALLOWED_ORIGINS` | CORS origins | `https://aiforcoders.vercel.app` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | `900000` (15 min) |
| `RATE_LIMIT_MAX` | Max requests per window | `100` |

### Setting Environment Variables

#### Via Vercel Dashboard

1. Go to your project in Vercel dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable:
   - **Name:** Variable name (e.g., `GEMINI_API_KEY`)
   - **Value:** Actual value
   - **Environment:** Select production, preview, and/or development
   - Click **Add**

#### Via Vercel CLI

```bash
# Add environment variable
vercel env add GEMINI_API_KEY production
# Enter the value when prompted

# List environment variables
vercel env ls

# Remove environment variable
vercel env rm GEMINI_API_KEY production
```

## Domain Configuration

### Custom Domain (Optional)

1. **Purchase Domain:**
   - Buy a domain from any registrar (Namecheap, GoDaddy, etc.)

2. **Add Domain in Vercel:**
   - Go to project **Settings** → **Domains**
   - Add your custom domain (e.g., `aiforcoders.com`)
   - Follow DNS configuration instructions

3. **DNS Configuration:**
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   
   Type: A
   Name: @
   Value: 76.76.19.61
   ```

### SSL Certificate

Vercel automatically provides SSL certificates for:
- All `.vercel.app` domains
- Custom domains (via Let's Encrypt)

No additional configuration needed.

## Monitoring and Logs

### Vercel Dashboard

#### Function Logs

1. **Access Logs:**
   - Go to **Functions** tab in Vercel dashboard
   - Click on any function to see logs
   - Filter by environment (production, preview)

2. **Real-time Logs:**
   ```bash
   vercel logs [deployment-url]
   ```

#### Analytics

1. **Web Analytics:**
   - Available in **Analytics** tab
   - Shows page views, unique visitors, bandwidth

2. **Function Analytics:**
   - Shows function execution time, memory usage
   - Helps identify performance bottlenecks

### Error Tracking

#### Client-side Errors

```typescript
// Add error tracking in your app
window.addEventListener('error', (event) => {
  console.error('Global error:', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error
  });
});
```

#### Server-side Errors

```typescript
// API error logging
console.error('API Error:', {
  error: error.message,
  stack: error.stack,
  url: req.url,
  method: req.method,
  timestamp: new Date().toISOString(),
  requestId: req.headers['x-request-id']
});
```

### Health Checks

#### API Health Endpoint

```bash
curl https://api.aiforcoders.vercel.app/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-25T10:30:00.000Z",
  "version": "1.0.0",
  "environment": "production"
}
```

## Troubleshooting

### Common Deployment Issues

#### 1. Build Failures

**Problem:** Build command fails
```bash
Error: Command "pnpm run build" exited with 1
```

**Solutions:**
```bash
# Check if all dependencies are listed
pnpm install

# Verify build script works locally
pnpm run build

# Check for TypeScript errors
pnpm typecheck

# Clear build cache
rm -rf node_modules/.cache
rm -rf apps/*/dist
```

#### 2. Environment Variable Issues

**Problem:** Environment variable not found
```bash
Error: Missing required environment variable: GEMINI_API_KEY
```

**Solutions:**
1. Verify variables are set in Vercel dashboard
2. Check variable names match exactly (case-sensitive)
3. Ensure variables are set for the correct environment
4. Redeploy after adding variables

#### 3. API Connection Issues

**Problem:** Web app can't connect to API
```bash
GET https://api.aiforcoders.vercel.app/api/health net::ERR_FAILED
```

**Solutions:**
1. Verify `NEXT_PUBLIC_API_URL` is set correctly
2. Check API function is deployed and working
3. Test API endpoint directly
4. Check CORS configuration

#### 4. Gemini API Issues

**Problem:** AI features not working
```bash
Error: API key invalid or quota exceeded
```

**Solutions:**
1. Verify `GEMINI_API_KEY` is correct
2. Check API usage limits in Google Cloud Console
3. Ensure billing is enabled for your Google Cloud project
4. Monitor API usage and costs

### Debugging Steps

#### 1. Check Build Logs

1. Go to Vercel dashboard → **Deployments**
2. Click on the failed deployment
3. Review build logs for errors
4. Look for specific error messages

#### 2. Test Locally

```bash
# Clone repository
git clone https://github.com/SudheendraSripada/ai-for-coders-web.git
cd ai-for-coders-web

# Install dependencies
pnpm install

# Copy environment template
cp .env.example .env.local
# Edit .env.local with your values

# Build locally
pnpm run build

# Test API locally
cd apps/api
vercel dev
```

#### 3. Check Function Logs

```bash
# View real-time logs
vercel logs [deployment-url]

# Download logs
vercel logs [deployment-url] --no-follow > logs.txt
```

### Performance Optimization

#### Build Optimization

```bash
# Analyze bundle size
npx vite-bundle-analyzer apps/web/dist

# Check for large dependencies
pnpm why [package-name]

# Optimize imports
# Use tree-shaking friendly imports
import { signal } from '@angular/core'; // Good
import * as Angular from '@angular/core'; // Bad
```

#### Function Optimization

```typescript
// Use efficient algorithms
// Cache expensive operations
// Minimize cold starts
```

### Scaling Considerations

#### Vercel Limits

- **Free Tier:**
  - 100GB bandwidth
  - 1000 function invocations per day
  - 10 second timeout

- **Pro Tier:**
  - 1TB bandwidth
  - 10M function invocations
  - 60 second timeout

#### Optimization Strategies

1. **Reduce Function Cold Starts:**
   - Minimize dependencies
   - Use efficient imports
   - Cache database connections

2. **Reduce Bandwidth:**
   - Implement caching
   - Optimize images
   - Use CDN for static assets

3. **Reduce Function Invocations:**
   - Implement client-side caching
   - Use incremental static generation
   - Batch API requests

## Rollback and Recovery

### Rollback to Previous Version

1. **Via Vercel Dashboard:**
   - Go to **Deployments** tab
   - Find the working deployment
   - Click **Promote to Production**

2. **Via CLI:**
   ```bash
   vercel promote [deployment-url]
   ```

### Disaster Recovery

1. **Database Backup:**
   - If using a database, set up automated backups
   - Test restoration procedures

2. **Environment Backup:**
   - Document all environment variables
   - Keep configuration files in version control
   - Create deployment runbook

---

**🎉 Congratulations!** Your AI for Coders application is now deployed and running on Vercel. Monitor the application and check the logs regularly to ensure everything is working correctly.