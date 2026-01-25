# Development Guide

This guide will help you set up the development environment for the AI for Coders project and understand the codebase structure.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Code Style](#code-style)
- [Testing](#testing)
- [Debugging](#debugging)
- [Performance](#performance)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software

- **Node.js** 18.0.0 or higher
- **PNPM** 8.0.0 or higher
- **Git** for version control
- **VS Code** (recommended) with extensions:
  - TypeScript and JavaScript Language Features
  - Angular Language Service
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense

### External Services

- **Google Gemini API Key** - Get from [Google AI Studio](https://makersuite.google.com/app/apikey)
- **Vercel Account** - For deployment (optional for local development)

## Environment Setup

### 1. Clone Repository

```bash
git clone https://github.com/SudheendraSripada/ai-for-coders-web.git
cd ai-for-coders-web
```

### 2. Install Dependencies

```bash
pnpm install
```

This will install all dependencies for the monorepo including:
- Web application dependencies
- API backend dependencies
- Shared package dependencies
- Development dependencies

### 3. Environment Configuration

Copy the environment template:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```bash
# Required for development
NODE_ENV=development
GEMINI_API_KEY=your-gemini-api-key-here

# Optional but recommended
JWT_SECRET=your-development-jwt-secret
SECRET_KEY=your-development-secret-key

# Local development URLs
API_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 4. Google Gemini API Setup

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the generated key
4. Add it to your `.env.local` file:

```bash
GEMINI_API_KEY=AIzaSy...your-key-here
```

### 5. Verify Setup

Run the development servers:

```bash
# Start all services
pnpm dev

# Or start individual services
pnpm dev:web    # Web app on http://localhost:4200
pnpm dev:api    # API on http://localhost:3000
```

You should see:
- Web application running at `http://localhost:4200`
- API health check at `http://localhost:3000/api/health`

## Project Structure

```
ai-for-coders-web/
├── apps/                           # Applications
│   ├── web/                        # Angular web application
│   │   ├── src/
│   │   │   ├── main.ts            # Bootstrap file
│   │   │   ├── index.html         # HTML entry point
│   │   │   ├── app.component.ts   # Main component
│   │   │   └── components/        # Angular components
│   │   │       ├── architecture-view.component.ts
│   │   │       ├── folder-structure.component.ts
│   │   │       ├── ai-playground.component.ts
│   │   │       └── api-key-setup.component.ts
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── vite.config.ts
│   │   └── tailwind.config.js
│   └── api/                        # Vercel serverless API
│       ├── src/
│       │   ├── index.ts            # Main API handler
│       │   ├── config/
│       │   │   └── env.config.ts   # Environment configuration
│       │   ├── api/                # API route handlers
│       │   │   ├── auth/
│       │   │   ├── chat/
│       │   │   ├── brain/
│       │   │   ├── automation/
│       │   │   └── middleware/
│       │   └── utils/
│       │       └── encryption.util.ts
│       ├── package.json
│       └── tsconfig.json
├── packages/                       # Shared packages
│   ├── shared/                     # Shared types and utilities
│   │   ├── src/
│   │   │   ├── types/
│   │   │   ├── constants/
│   │   │   └── utils/
│   │   └── package.json
│   └── ui/                         # Shared UI components
│       ├── src/
│       │   ├── components/
│       │   └── styles/
│       └── package.json
├── docs/                           # Documentation
│   ├── ARCHITECTURE.md
│   ├── API_ROUTES.md
│   ├── DEVELOPMENT.md
│   └── DEPLOYMENT.md
├── scripts/                        # Automation scripts
│   ├── setup-vercel.sh
│   ├── test-build.sh
│   └── deploy.sh
├── .github/                        # CI/CD workflows
│   └── workflows/
│       └── deploy.yml
├── vercel.json                     # Vercel configuration
├── package.json                    # Root package.json
├── pnpm-workspace.yaml            # PNPM workspace configuration
├── turbo.json                      # Turbo build configuration
├── tsconfig.json                   # Root TypeScript config
└── .gitignore
```

## Development Workflow

### Starting Development

1. **Start the development servers:**
   ```bash
   pnpm dev
   ```

2. **Access the application:**
   - Web App: http://localhost:4200
   - API: http://localhost:3000
   - API Health: http://localhost:3000/api/health

### Making Changes

1. **Web Application (Angular):**
   - Edit files in `apps/web/src/`
   - Hot reload is enabled by default
   - Changes are reflected immediately in the browser

2. **API Backend:**
   - Edit files in `apps/api/src/`
   - Vercel dev server provides hot reload
   - Test API endpoints directly or via the web app

3. **Shared Types:**
   - Update types in `packages/shared/src/types/`
   - Changes are automatically available in all apps

### Building

```bash
# Build all packages
pnpm build

# Build specific packages
pnpm build:web
pnpm build:api
```

### Code Quality

```bash
# Run linting
pnpm lint

# Format code
pnpm format

# Type checking
pnpm typecheck
```

### Testing

```bash
# Run all tests
pnpm test

# Run tests for specific packages
pnpm test --filter="@ai-for-coders/web"
pnpm test --filter="@ai-for-coders/api"
```

## Code Style

### TypeScript Configuration

We use strict TypeScript settings:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true
  }
}
```

### Angular Style Guide

Follow [Angular's official style guide](https://angular.io/guide/styleguide):

- Use standalone components
- Follow the naming conventions
- Use Angular signals for state management
- Prefer composition over inheritance

### API Design Patterns

#### Consistent Response Format

```typescript
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    timestamp: string;
  };
}
```

#### Error Handling

```typescript
export function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
```

### CSS/Styling

#### Tailwind CSS

- Use utility-first approach
- Follow responsive design patterns
- Use consistent color scheme from design tokens

#### Example Component Styling

```html
<div class="flex items-center justify-between p-4 bg-zinc-900 border border-zinc-700 rounded-lg">
  <h2 class="text-lg font-semibold text-zinc-200">Component Title</h2>
  <button class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
    Action
  </button>
</div>
```

## Testing

### Web Application Testing

#### Unit Tests (Recommended)

```typescript
// Example component test
import { TestBed } from '@angular/core/testing';
import { AiPlaygroundComponent } from './ai-playground.component';

describe('AiPlaygroundComponent', () => {
  let component: AiPlaygroundComponent;
  let fixture: ComponentFixture<AiPlaygroundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiPlaygroundComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AiPlaygroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default settings', () => {
    expect(component.settings()).toBeDefined();
  });
});
```

#### E2E Testing (Future)

```typescript
// cypress/e2e/ai-playground.cy.ts
describe('AI Playground', () => {
  it('should send a message and receive response', () => {
    cy.visit('/playground');
    cy.get('[data-testid="message-input"]').type('Hello AI');
    cy.get('[data-testid="send-button"]').click();
    cy.get('[data-testid="message-response"]').should('contain', 'Hello');
  });
});
```

### API Testing

#### Unit Tests

```typescript
// apps/api/src/__tests__/chat.test.ts
import { describe, it, expect } from '@jest/globals';
import { chatHandler } from '../api/chat/chat.handler';

describe('Chat API', () => {
  it('should handle message requests', async () => {
    const mockReq = {
      method: 'POST',
      body: {
        message: 'Hello',
        model: 'gemini-pro',
        temperature: 0.7
      }
    };
    
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await chatHandler(mockReq, mockRes);
    
    expect(mockRes.status).toHaveBeenCalledWith(200);
  });
});
```

#### Integration Tests

```typescript
// Integration test example
import request from 'supertest';

describe('Chat API Integration', () => {
  it('should process chat messages', async () => {
    const response = await request(app)
      .post('/api/v1/chat/message')
      .set('Authorization', 'Bearer test-api-key')
      .send({
        message: 'Explain TypeScript interfaces',
        model: 'gemini-pro'
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBeDefined();
  });
});
```

## Debugging

### Web Application

#### VS Code Debugging Setup

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Angular App",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/vite",
      "args": ["--config", "apps/web/vite.config.ts"],
      "cwd": "${workspaceFolder}",
      "env": {
        "NODE_ENV": "development"
      },
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

#### Browser Debugging

1. Open Chrome DevTools (F12)
2. Go to Sources tab
3. Navigate to webpack:// → src
4. Set breakpoints in your TypeScript files

### API Backend

#### VS Code Debugging

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug API",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/vercel",
      "args": ["dev"],
      "cwd": "${workspaceFolder}/apps/api",
      "console": "integratedTerminal",
      "env": {
        "NODE_ENV": "development"
      }
    }
  ]
}
```

#### API Testing with curl

```bash
# Test health endpoint
curl http://localhost:3000/api/health

# Test chat endpoint
curl -X POST http://localhost:3000/api/v1/chat/message \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_GEMINI_API_KEY" \
  -d '{"message": "Hello"}'
```

### Common Debugging Techniques

#### Console Logging

```typescript
// Angular component
console.log('Component initialized', {
  tab: activeTab(),
  timestamp: new Date().toISOString()
});

// API handler
console.log('Request received', {
  method: req.method,
  url: req.url,
  body: req.body,
  timestamp: new Date().toISOString()
});
```

#### Error Boundaries

```typescript
// Angular error boundary
export class ErrorBoundary implements ErrorHandler {
  handleError(error: any): void {
    console.error('Global error:', error);
    // Log to external service
  }
}
```

## Performance

### Web Application Optimization

#### Bundle Analysis

```bash
# Analyze bundle size
npx vite-bundle-analyzer apps/web/dist

# Check build output
ls -la apps/web/dist/assets/
```

#### Lazy Loading

```typescript
// Route-based code splitting (future enhancement)
const routes: Routes = [
  {
    path: 'playground',
    loadComponent: () => import('./components/ai-playground.component').then(m => m.AiPlaygroundComponent)
  }
];
```

#### Angular Performance Tips

1. **Use OnPush Change Detection:**
   ```typescript
   @Component({
     changeDetection: ChangeDetectionStrategy.OnPush
   })
   ```

2. **Optimize Signals:**
   ```typescript
   // Use computed for derived state
   const filteredItems = computed(() => 
     items().filter(item => item.active)
   );
   ```

### API Performance

#### Response Optimization

```typescript
// Use streaming for large responses
export async function streamResponse(res: Response, generator: AsyncGenerator) {
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Transfer-Encoding', 'chunked');
  
  for await (const chunk of generator) {
    res.write(chunk);
  }
  res.end();
}
```

#### Caching Strategy

```typescript
// Simple in-memory cache
const cache = new Map<string, { data: any; expiry: number }>();

export function getCached(key: string): any | null {
  const item = cache.get(key);
  if (!item) return null;
  
  if (Date.now() > item.expiry) {
    cache.delete(key);
    return null;
  }
  
  return item.data;
}
```

## Troubleshooting

### Common Issues

#### 1. Build Errors

**Problem:** TypeScript compilation errors
```bash
Error: TS2307: Cannot find module '@google/generative-ai'
```

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

#### 2. API Connection Issues

**Problem:** Web app can't connect to API
```bash
GET http://localhost:3000/api/health net::ERR_CONNECTION_REFUSED
```

**Solution:**
1. Ensure API server is running: `pnpm dev:api`
2. Check API URL in environment variables
3. Verify CORS configuration

#### 3. Environment Variables

**Problem:** Missing or incorrect environment variables
```bash
Error: Missing required environment variable: GEMINI_API_KEY
```

**Solution:**
1. Check `.env.local` file exists
2. Verify all required variables are set
3. Restart development server after changes

#### 4. Angular Compilation

**Problem:** Angular template errors
```bash
Error: Template parse errors: 'app-ai-playground' is not a known element
```

**Solution:**
1. Check component imports in `main.ts`
2. Verify standalone component configuration
3. Clear Angular cache: `rm -rf .angular`

### Performance Issues

#### Slow Development Server

```bash
# Check system resources
top
htop

# Clean build cache
rm -rf apps/web/dist
rm -rf node_modules/.cache
```

#### Large Bundle Size

```bash
# Analyze bundle
npx vite-bundle-analyzer apps/web/dist/stats.json

# Common solutions:
# 1. Remove unused dependencies
# 2. Implement code splitting
# 3. Optimize images and assets
```

### Getting Help

#### Internal Resources

1. **Code Review:** Check existing patterns in the codebase
2. **Documentation:** Refer to `docs/` folder for detailed guides
3. **Architecture:** Review `docs/ARCHITECTURE.md` for system design

#### External Resources

1. **Angular Documentation:** https://angular.io/docs
2. **Vercel Documentation:** https://vercel.com/docs
3. **Google Gemini API:** https://ai.google.dev/
4. **Tailwind CSS:** https://tailwindcss.com/docs

#### Issue Reporting

When reporting issues, include:

1. **Environment:** OS, Node version, PNPM version
2. **Steps to reproduce:** Clear steps that led to the issue
3. **Expected vs actual:** What should happen vs what happened
4. **Logs:** Relevant error messages and console output
5. **Screenshots:** For UI-related issues

Example issue report:

```markdown
## Environment
- OS: macOS 13.0
- Node: v18.17.0
- PNPM: 8.6.0
- Browser: Chrome 117

## Steps to Reproduce
1. Start development server: `pnpm dev`
2. Navigate to http://localhost:4200
3. Click on "AI Playground" tab
4. Enter a message and click send

## Expected Behavior
Message should be sent and AI response displayed

## Actual Behavior
Console shows error: "Failed to fetch"

## Error Logs
```
GET http://localhost:3000/api/v1/chat/message net::ERR_CONNECTION_REFUSED
```

## Environment Variables
GEMINI_API_KEY=AIzaSy... (set correctly)
```

---

Happy coding! 🚀