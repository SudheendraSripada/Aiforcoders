// Environment variables and constants
export const API_ENDPOINTS = {
  AUTH: {
    PAIR: '/api/v1/auth/pair',
    VERIFY: '/api/v1/auth/verify'
  },
  CHAT: {
    MESSAGE: '/api/v1/chat/message',
    HISTORY: '/api/v1/chat/history'
  },
  BRAIN: {
    ANALYZE: '/api/v1/brain/analyze',
    EXPLAIN: '/api/v1/brain/explain',
    REFACTOR: '/api/v1/brain/refactor'
  },
  AUTOMATION: {
    CAPTURE: '/api/v1/automation/capture',
    APPLY_FIX: '/api/v1/automation/apply-fix'
  },
  HEALTH: '/api/health'
} as const;

// Supported AI Models
export const AI_MODELS = {
  GEMINI_PRO: 'gemini-pro',
  GEMINI_PRO_VISION: 'gemini-pro-vision'
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  API_KEYS: 'ai_coders_api_keys',
  CHAT_HISTORY: 'ai_coders_chat_history',
  PROMPT_TEMPLATES: 'ai_coders_prompt_templates',
  USER_SETTINGS: 'ai_coders_user_settings',
  THEME: 'ai_coders_theme',
  RECENT_CONVERSATIONS: 'ai_coders_recent_conversations'
} as const;

// Application Constants
export const APP_CONFIG = {
  NAME: 'AI for Coders',
  VERSION: '1.0.0',
  DESCRIPTION: 'AI-powered development assistant for coders',
  AUTHOR: 'AI for Coders Team',
  REPOSITORY: 'https://github.com/SudheendraSripada/ai-for-coders-web',
  WEBSITE: 'https://aiforcoders.vercel.app',
  SUPPORT_EMAIL: 'support@aiforcoders.com'
} as const;

// UI Constants
export const UI_CONFIG = {
  SIDEBAR_WIDTH: 256,
  TOOLBAR_HEIGHT: 64,
  DEFAULT_TEMPERATURE: 0.7,
  MAX_MESSAGE_LENGTH: 4000,
  MAX_CODE_LENGTH: 32000,
  DEFAULT_FONT_SIZE: 14,
  ANIMATION_DURATION: 200,
  TOAST_DURATION: 3000,
  DEBOUNCE_DELAY: 300
} as const;

// API Configuration
export const API_CONFIG = {
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
  RATE_LIMIT: {
    WINDOW: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100
  }
} as const;

// Error Codes
export const ERROR_CODES = {
  INVALID_API_KEY: 'INVALID_API_KEY',
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  INVALID_REQUEST: 'INVALID_REQUEST',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  QUOTA_EXCEEDED: 'QUOTA_EXCEEDED',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  INTERNAL_ERROR: 'INTERNAL_ERROR'
} as const;

// Validation Patterns
export const VALIDATION_PATTERNS = {
  API_KEY: /^[A-Za-z0-9_-]{20,}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL: /^https?:\/\/[^\s$.?#].[^\s]*$/,
  CODE: {
    TYPESCRIPT: /\.ts$/,
    JAVASCRIPT: /\.js$/,
    PYTHON: /\.py$/,
    JAVA: /\.java$/,
    CPP: /\.(cpp|c\+\+|cc|cxx)$/,
    C: /\.c$/,
    GO: /\.go$/,
    RUST: /\.rs$/,
    PHP: /\.php$/,
    RUBY: /\.rb$/,
    SWIFT: /\.swift$/,
    KOTLIN: /\.kt$/,
    SCALA: /\.scala$/,
    HTML: /\.html$/,
    CSS: /\.css$/,
    SCSS: /\.scss$/,
    SASS: /\.sass$/,
    JSON: /\.json$/,
    YAML: /\.(yaml|yml)$/,
    XML: /\.xml$/,
    SQL: /\.sql$/,
    MARKDOWN: /\.md$/
  }
} as const;

// Language Mappings
export const LANGUAGE_MAPPINGS = {
  typescript: 'TypeScript',
  javascript: 'JavaScript',
  python: 'Python',
  java: 'Java',
  'c++': 'C++',
  cpp: 'C++',
  c: 'C',
  go: 'Go',
  rust: 'Rust',
  php: 'PHP',
  ruby: 'Ruby',
  swift: 'Swift',
  kotlin: 'Kotlin',
  scala: 'Scala',
  html: 'HTML',
  css: 'CSS',
  scss: 'SCSS',
  sass: 'Sass',
  json: 'JSON',
  yaml: 'YAML',
  yml: 'YAML',
  xml: 'XML',
  sql: 'SQL',
  markdown: 'Markdown',
  bash: 'Bash',
  shell: 'Shell'
} as const;

// Theme Colors
export const THEME_COLORS = {
  light: {
    primary: '#3b82f6',
    secondary: '#64748b',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#06b6d4'
  },
  dark: {
    primary: '#60a5fa',
    secondary: '#94a3b8',
    success: '#34d399',
    warning: '#fbbf24',
    error: '#f87171',
    info: '#22d3ee'
  }
} as const;

// Feature Flags
export const FEATURE_FLAGS = {
  STREAMING: true,
  CODE_ANALYSIS: true,
  AUTOMATION: true,
  PAIRING: true,
  HISTORY: true,
  EXPORT: true,
  COLLABORATION: false,
  ENTERPRISE: false
} as const;