# System Architecture

This document outlines the system architecture of the AI for Coders platform, describing the overall design, components, and data flow.

## Overview

The AI for Coders platform is a comprehensive development assistant that combines multiple applications and services:

- **Web Application** - Angular 18 standalone application
- **API Backend** - Vercel serverless functions
- **Shared Packages** - Reusable TypeScript code
- **Desktop Application** - Electron-based desktop app (planned)

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Web Application                         │
│                        (Angular 18)                           │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │
│  │ Architecture│  │   Folder    │  │    AI       │  │   API   │ │
│  │    View     │  │  Structure  │  │ Playground  │  │   Key   │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────┘ │
│                            │                              │     │
│                            └──────────┬───────────────────┘     │
│                                       │                           │
└───────────────────────────────────────┼───────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Backend                                │
│                    (Vercel Serverless)                         │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │
│  │   Auth      │  │    Chat     │  │    Brain    │  │ Automat.│ │
│  │   API       │  │    API      │  │    API      │  │   API   │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────┘ │
│                            │                              │     │
│                            └──────────┬───────────────────┘     │
│                                       │                           │
└───────────────────────────────────────┼───────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                   External Services                              │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │
│  │   Google    │  │  localStorage│  │    Vercel   │  │ GitHub  │ │
│  │   Gemini    │  │  (Browser)   │  │  Deployment │  │ Actions │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Component Architecture

### Web Application (Angular 18)

#### Core Components

1. **AppComponent**
   - Main layout with sidebar navigation
   - Tab management for different views
   - Responsive design handling

2. **ArchitectureViewComponent**
   - System design documentation
   - Vision & principles display
   - Pairing & data flow visualization

3. **FolderStructureComponent**
   - Interactive file tree
   - Recursive node rendering
   - Expandable folder navigation

4. **AiPlaygroundComponent**
   - Live AI interaction interface
   - Model selection (Gemini Pro)
   - Temperature and system instruction controls
   - Chat message handling
   - Code analysis capabilities

5. **ApiKeySetupComponent**
   - Gemini API key configuration
   - Key validation and storage
   - Environment-specific settings

#### State Management

```typescript
// Angular Signals for reactive state
export interface AppState {
  activeTab: Signal<Tab>;
  apiKey: Signal<string | null>;
  chatHistory: Signal<ChatMessage[]>;
  settings: Signal<UISettings>;
}
```

#### Data Flow

```
User Interaction → Component → Service → API → External Service
        ▲
        │
Local Storage ← Settings Manager ← State Manager
```

### API Backend (Vercel Serverless)

#### Architecture

```
Vercel Edge Functions
├── Route Handlers
│   ├── /api/v1/auth/*     - Authentication
│   ├── /api/v1/chat/*     - Chat operations
│   ├── /api/v1/brain/*    - Code analysis
│   └── /api/v1/automation/* - Screenshot automation
├── Middleware
│   ├── Error handling
│   ├── CORS configuration
│   └── Rate limiting
└── Utilities
    ├── Environment configuration
    ├── Encryption utilities
    └── Validation helpers
```

#### Request Flow

```
Client Request
     │
     ▼
CORS Middleware
     │
     ▼
Rate Limiter
     │
     ▼
Router (Path-based)
     │
     ▼
Handler Function
     │
     ▼
Google Gemini API
     │
     ▼
Response Formatter
     │
     ▼
Client Response
```

#### Error Handling

```typescript
// Global error handler
export function errorHandler(error: any, req: Request, res: Response) {
  console.error('Error:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: {
      code: error.code || 'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'production' 
        ? 'Something went wrong' 
        : message,
      timestamp: new Date().toISOString()
    }
  });
}
```

### Shared Packages

#### Package Structure

```
packages/
├── shared/
│   ├── src/
│   │   ├── types/          - TypeScript interfaces
│   │   ├── constants/      - Application constants
│   │   └── utils/          - Utility functions
│   └── package.json
└── ui/
    ├── src/
    │   ├── components/     - Shared UI components
    │   └── styles/         - Global styles
    └── package.json
```

#### Shared Types

```typescript
// Core API types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  metadata?: {
    model?: string;
    tokens?: { prompt: number; completion: number; total: number };
    temperature?: number;
  };
}

// UI types
export interface UISettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  fontSize: 'small' | 'medium' | 'large';
  codeTheme: string;
  autoSave: boolean;
  showLineNumbers: boolean;
  wordWrap: boolean;
}
```

## Data Models

### Chat System

```typescript
interface ChatHistory {
  id: string;
  userId: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
  metadata: {
    model: string;
    totalTokens: number;
    temperature: number;
  };
}
```

### Code Analysis

```typescript
interface CodeAnalysis {
  type: 'security' | 'performance' | 'general';
  language: string;
  findings: string;
  suggestions: string[];
  confidence: number;
  timestamp: string;
}
```

### User Settings

```typescript
interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  fontSize: 'small' | 'medium' | 'large';
  codeTheme: string;
  autoSave: boolean;
  showLineNumbers: boolean;
  wordWrap: boolean;
  apiKeys: {
    gemini?: string;
  };
  recentPrompts: PromptTemplate[];
}
```

## Security Architecture

### Authentication Flow

```
User Device → Pairing Request → API Validation → Token Generation
     │              │              │              │
     ▼              ▼              ▼              ▼
Browser      Vercel API     JWT Secret   Encrypted Token
Storage     Handler        Generation    Storage
```

### API Security

1. **Environment Variables**
   - Secure configuration management
   - No hardcoded secrets
   - Type-safe environment loading

2. **Input Validation**
   - Request payload validation
   - SQL injection prevention
   - XSS protection

3. **Rate Limiting**
   - Request throttling per IP
   - Token bucket algorithm
   - Configurable limits

4. **CORS Configuration**
   - Restricted origins
   - Credential handling
   - Method restrictions

### Data Encryption

```typescript
// Encryption utilities
export function encrypt(text: string): string {
  const cipher = crypto.createCipher(algorithm, key);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}
```

## Performance Architecture

### Web Application Optimization

1. **Bundle Optimization**
   - Code splitting with Angular lazy loading
   - Tree shaking for unused code
   - Dynamic imports for heavy components

2. **Caching Strategy**
   - Service worker for offline capability
   - HTTP caching for API responses
   - localStorage for user preferences

3. **Rendering Optimization**
   - Angular signals for reactive updates
   - OnPush change detection strategy
   - Virtual scrolling for large lists

### API Performance

1. **Serverless Scaling**
   - Automatic scaling based on demand
   - Cold start optimization
   - Regional deployment

2. **Response Optimization**
   - Response compression
   - Efficient data serialization
   - Minimal payload sizes

## Deployment Architecture

### Vercel Configuration

```json
{
  "version": 2,
  "buildCommand": "pnpm run build",
  "devCommand": "pnpm run dev",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "env": {
    "NODE_ENV": { "value": "production" },
    "GEMINI_API_KEY": { "required": true },
    "SECRET_KEY": { "required": true }
  }
}
```

### Environment Management

```
Development → Staging → Production
     │           │          │
     ▼           ▼          ▼
Local DB   Staging DB   Production DB
Secrets    Staging     Production
           Secrets     Secrets
```

## Monitoring and Observability

### Logging Strategy

```typescript
// Structured logging
console.error('Error:', {
  message: error.message,
  url: req.url,
  method: req.method,
  userAgent: req.headers['user-agent'],
  timestamp: new Date().toISOString(),
  requestId: req.headers['x-request-id']
});
```

### Error Tracking

1. **Client-side Errors**
   - JavaScript error boundaries
   - Performance monitoring
   - User interaction tracking

2. **Server-side Errors**
   - API error logging
   - Performance metrics
   - Health check endpoints

## Future Architecture Considerations

### Desktop Application

```
┌─────────────────────────────────────┐
│         Desktop App (Electron)       │
├─────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐   │
│  │   Native    │  │   Web       │   │
│  │   Features  │  │   Content   │   │
│  └─────────────┘  └─────────────┘   │
│           │              │           │
│           └──────┬───────┘           │
│                  │                   │
└──────────────────┼───────────────────┘
                   │
                   ▼
            ┌─────────────┐
            │   Local     │
            │   Storage   │
            └─────────────┘
```

### Microservices Evolution

```
API Gateway → Auth Service → Chat Service → Brain Service → Automation Service
     │            │             │              │              │
     ▼            ▼             ▼              ▼              ▼
Database    Auth DB       Chat DB        Analysis DB    Automation DB
```

## Technology Decisions

### Angular 18
- **Why**: Latest standalone components, signals, excellent TypeScript support
- **Alternatives**: React, Vue.js, Svelte
- **Decision**: Angular's enterprise features and ecosystem

### Vercel Serverless
- **Why**: Easy deployment, automatic scaling, edge functions
- **Alternatives**: AWS Lambda, Netlify Functions, Railway
- **Decision**: Developer experience and deployment simplicity

### Google Gemini
- **Why**: Cutting-edge AI, good developer experience, cost-effective
- **Alternatives**: OpenAI GPT, Anthropic Claude, Cohere
- **Decision**: Google's latest AI technology and integration ease

### TypeScript
- **Why**: Type safety, better developer experience, large ecosystem
- **Alternatives**: JavaScript, Flow, Dart
- **Decision**: Strong typing for enterprise applications

### Tailwind CSS
- **Why**: Utility-first, fast development, consistent design
- **Alternatives**: CSS Modules, Styled Components, Material-UI
- **Decision**: Flexibility and design system consistency

## Scalability Considerations

### Horizontal Scaling

1. **Web Application**
   - CDN distribution
   - Load balancing
   - Geographic distribution

2. **API Backend**
   - Serverless auto-scaling
   - Regional deployment
   - Database sharding

### Vertical Scaling

1. **Resource Optimization**
   - Efficient algorithms
   - Memory management
   - CPU optimization

2. **Caching Layers**
   - Redis for session data
   - CDN for static assets
   - Browser caching

## Security Best Practices

### Data Protection

1. **Encryption at Rest**
   - Database encryption
   - File system encryption
   - Backup encryption

2. **Encryption in Transit**
   - HTTPS everywhere
   - Certificate management
   - Secure headers

3. **Access Control**
   - Role-based access
   - API key management
   - Session handling

### Privacy Compliance

1. **Data Minimization**
   - Collect only necessary data
   - Regular data purging
   - User consent management

2. **GDPR Compliance**
   - Right to be forgotten
   - Data portability
   - Privacy by design

---

*This architecture document will evolve as the platform grows and new requirements emerge.*