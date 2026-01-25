export const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // API Configuration
  API_URL: process.env.API_URL || 'http://localhost:3000',
  PORT: parseInt(process.env.PORT || '3000', 10),
  
  // Authentication
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  SECRET_KEY: process.env.SECRET_KEY || 'your-secret-key-change-in-production',
  
  // Google Gemini
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  
  // Database (if needed in future)
  DATABASE_URL: process.env.DATABASE_URL,
  
  // Vercel specific
  VERCEL_ENV: process.env.VERCEL_ENV,
  VERCEL_URL: process.env.VERCEL_URL,
  
  // Frontend URL
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  
  // CORS
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:4200'],
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || '100', 10), // limit each IP to 100 requests per windowMs
  
  // Encryption
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || 'your-encryption-key-32-chars',
  ENCRYPTION_IV: process.env.ENCRYPTION_IV || 'your-iv-16-chars',
} as const;

// Validate required environment variables
export function validateConfig() {
  const required = ['GEMINI_API_KEY'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

// Helper function to check if we're in production
export function isProduction() {
  return config.NODE_ENV === 'production';
}

// Helper function to check if we're in development
export function isDevelopment() {
  return config.NODE_ENV === 'development';
}