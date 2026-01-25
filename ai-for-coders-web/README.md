# AI for Coders

A comprehensive AI-powered development assistant that combines a web application, API backend, and desktop application to enhance developer productivity through intelligent code analysis, chat assistance, and automation features.

## 🚀 Features

### Web Application (Angular 18)
- **Interactive Architecture Documentation** - System design and architecture views
- **AI Playground** - Live GenAI prototype with Google Gemini integration
- **Folder Structure Explorer** - Visual representation of project files
- **Real-time Chat Interface** - Streaming AI conversations with markdown support
- **Code Analysis & Explanation** - Deep dive into code with AI insights
- **Prompt Template Management** - Create, save, and reuse AI prompts
- **Local Storage Persistence** - Chat history and settings saved locally
- **API Key Management** - Secure Gemini API key configuration

### API Backend (Vercel Serverless)
- **Authentication & Pairing** - Secure device pairing system
- **Chat API** - Real-time messaging with Google Gemini
- **Brain Analysis** - Code analysis, explanation, and refactoring
- **Automation Services** - Screenshot capture and automated fixes
- **Rate Limiting & Security** - Built-in protection and encryption
- **Environment Configuration** - Type-safe environment variable management

### Core Capabilities
- **Multi-model Support** - Google Gemini Pro integration
- **Code Intelligence** - Analysis, explanation, and refactoring
- **Automation** - Automated screenshot analysis and fix suggestions
- **Developer Experience** - Clean, modern UI with Tailwind CSS
- **Production Ready** - Vercel deployment configuration included

## 🏗️ Architecture

```
ai-for-coders-web/
├── apps/
│   ├── web/           # Angular 18 web application
│   └── api/           # Vercel serverless API
├── packages/
│   ├── shared/        # Shared TypeScript types and utilities
│   └── ui/           # Shared UI components
├── docs/             # Documentation
├── scripts/          # Deployment and setup scripts
└── .github/          # CI/CD workflows
```

## 🛠️ Tech Stack

### Web Application
- **Angular 18** - Latest standalone components
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **Google Gemini SDK** - AI integration
- **Marked** - Markdown rendering
- **Angular Signals** - Reactive state management

### API Backend
- **Vercel Serverless** - Serverless deployment
- **TypeScript** - Full type safety
- **Google Generative AI** - Gemini integration
- **Node.js 18+** - Runtime environment
- **Encryption Utilities** - Secure data handling

### Development Tools
- **Turbo** - Monorepo build system
- **PNPM** - Fast, disk space efficient package manager
- **ESLint & Prettier** - Code quality and formatting
- **GitHub Actions** - CI/CD pipeline

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PNPM 8+
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### 1. Clone Repository
```bash
git clone https://github.com/SudheendraSripada/ai-for-coders-web.git
cd ai-for-coders-web
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Environment Setup
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

### 4. Development
```bash
# Start all services
pnpm dev

# Or start individual services
pnpm dev:web    # Start web application
pnpm dev:api    # Start API backend
```

### 5. Build for Production
```bash
pnpm build
```

### 6. Deploy to Vercel
```bash
pnpm deploy
```

## 📖 Documentation

- [📐 Architecture Overview](docs/ARCHITECTURE.md)
- [🚀 API Documentation](docs/API_ROUTES.md)
- [🛠️ Development Guide](docs/DEVELOPMENT.md)
- [🌐 Deployment Guide](docs/DEPLOYMENT.md)

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NODE_ENV` | Environment mode | No | `development` |
| `GEMINI_API_KEY` | Google Gemini API key | Yes | - |
| `JWT_SECRET` | JWT signing secret | No | Generated |
| `SECRET_KEY` | Encryption secret | No | Generated |
| `API_URL` | API base URL | No | `http://localhost:3000` |
| `NEXT_PUBLIC_API_URL` | Frontend API URL | No | `http://localhost:3000` |

### Google Gemini Setup

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env.local` file:
   ```bash
   GEMINI_API_KEY=your-actual-api-key-here
   ```

## 🎯 API Endpoints

### Authentication
- `POST /api/v1/auth/pair` - Device pairing
- `POST /api/v1/auth/verify` - Token verification

### Chat
- `POST /api/v1/chat/message` - Send message to AI
- `GET /api/v1/chat/history` - Get chat history
- `POST /api/v1/chat/history` - Save chat history

### Brain Analysis
- `POST /api/v1/brain/analyze` - Analyze code
- `POST /api/v1/brain/explain` - Explain code
- `POST /api/v1/brain/refactor` - Refactor code

### Automation
- `POST /api/v1/automation/capture` - Analyze screenshots
- `POST /api/v1/automation/apply-fix` - Apply automated fixes

## 🎨 UI Components

### Web Application Features
- **Architecture View** - System design documentation
- **Folder Structure** - Interactive file explorer
- **AI Playground** - Live AI testing interface
- **Chat Interface** - Real-time conversations
- **Code Editor** - Syntax highlighting and analysis
- **Settings Panel** - Theme and preference management

### Design System
- **Dark Theme** - Professional dark mode interface
- **Responsive Design** - Works on desktop and mobile
- **Accessibility** - WCAG compliant components
- **Performance** - Optimized loading and rendering

## 🔒 Security

- **API Key Protection** - Client-side encryption
- **Rate Limiting** - Prevent abuse
- **Input Sanitization** - XSS protection
- **CORS Configuration** - Cross-origin security
- **Environment Isolation** - Separate dev/prod configs

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
# Build all packages
pnpm build

# Deploy to Vercel
vercel deploy --prod
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Google Gemini](https://ai.google.dev/) for AI capabilities
- [Vercel](https://vercel.com/) for serverless deployment
- [Angular](https://angular.io/) for the web framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Turbo](https://turbo.build/) for monorepo management

## 📞 Support

- 📧 Email: support@aiforcoders.com
- 🐛 Issues: [GitHub Issues](https://github.com/SudheendraSripada/ai-for-coders-web/issues)
- 📖 Documentation: [Project Wiki](https://github.com/SudheendraSripada/ai-for-coders-web/wiki)

---

**Built with ❤️ by the AI for Coders Team**