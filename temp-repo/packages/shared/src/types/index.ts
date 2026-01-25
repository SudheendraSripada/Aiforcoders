// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    timestamp: string;
    requestId?: string;
  };
}

// Chat Types
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  metadata?: {
    model?: string;
    tokens?: {
      prompt: number;
      completion: number;
      total: number;
    };
    temperature?: number;
  };
}

export interface ChatHistory {
  id: string;
  userId: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
  metadata?: {
    model?: string;
    totalTokens?: number;
    temperature?: number;
  };
}

export interface ChatRequest {
  message: string;
  history?: ChatMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemInstruction?: string;
}

// Authentication Types
export interface AuthRequest {
  code?: string;
  deviceId?: string;
  token?: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  expiresIn?: string;
  deviceId?: string;
  valid?: boolean;
  timestamp: string;
}

// Brain Analysis Types
export interface BrainAnalysisRequest {
  code: string;
  language?: string;
  analysisType?: 'general' | 'security' | 'performance' | 'accessibility';
}

export interface BrainAnalysisResponse {
  success: boolean;
  analysis: {
    type: string;
    language: string;
    findings: string;
    timestamp: string;
  };
}

export interface BrainExplainRequest {
  code: string;
  language?: string;
  detailLevel?: 'simple' | 'medium' | 'detailed';
}

export interface BrainExplainResponse {
  success: boolean;
  explanation: {
    code: string;
    language: string;
    detailLevel: string;
    explanation: string;
    timestamp: string;
  };
}

export interface BrainRefactorRequest {
  code: string;
  language?: string;
  refactorType?: 'general' | 'performance' | 'readability' | 'security' | 'architecture';
  constraints?: string[];
}

export interface BrainRefactorResponse {
  success: boolean;
  refactor: {
    original: string;
    language: string;
    type: string;
    refactored: string;
    constraints: string[];
    timestamp: string;
  };
}

// Automation Types
export interface AutomationCaptureRequest {
  screenshot: string; // base64 encoded
  context?: string;
  type?: 'screen' | 'element' | 'full-page';
}

export interface AutomationCaptureResponse {
  success: boolean;
  analysis: {
    type: string;
    context?: string;
    findings: Array<{
      element: string;
      issue: string;
      suggestion: string;
      confidence: number;
    }>;
    timestamp: string;
  };
}

export interface AutomationFixRequest {
  issue: string;
  currentCode: string;
  fixType?: 'automated' | 'guided' | 'manual';
}

export interface AutomationFixResponse {
  success: boolean;
  fix: {
    issue: string;
    currentCode: string;
    fixType: string;
    solution: string;
    timestamp: string;
  };
}

// Environment Configuration Types
export interface EnvironmentConfig {
  NODE_ENV: string;
  API_URL: string;
  PORT: number;
  GEMINI_API_KEY: string;
  JWT_SECRET: string;
  SECRET_KEY: string;
  DATABASE_URL?: string;
  NEXT_PUBLIC_API_URL: string;
  ALLOWED_ORIGINS: string[];
  RATE_LIMIT_WINDOW_MS: number;
  RATE_LIMIT_MAX: number;
  ENCRYPTION_KEY: string;
  ENCRYPTION_IV: string;
}

// UI Component Types
export interface AIModel {
  id: string;
  name: string;
  description: string;
  maxTokens: number;
  supportsStreaming: boolean;
  pricing: {
    input: number;
    output: number;
  };
}

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
  variables: string[];
  category: string;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UISettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  fontSize: 'small' | 'medium' | 'large';
  codeTheme: string;
  autoSave: boolean;
  showLineNumbers: boolean;
  wordWrap: boolean;
}

export interface AppState {
  isLoading: boolean;
  error: string | null;
  settings: UISettings;
  apiKeys: {
    gemini?: string;
  };
  recentPrompts: PromptTemplate[];
  chatHistory: ChatHistory[];
}