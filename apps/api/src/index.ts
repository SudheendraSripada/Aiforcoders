import { VercelRequest, VercelResponse } from '@vercel/node';
import { config } from './config/env.config';
import { authHandler } from './api/auth/auth.handler';
import { chatHandler } from './api/chat/chat.handler';
import { brainHandler } from './api/brain/brain.handler';
import { automationHandler } from './api/automation/automation.handler';
import { errorHandler } from './api/middleware/error.handler';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    const url = req.url || '';
    const path = url.split('?')[0];

    // Route handlers
    if (path.startsWith('/api/v1/auth/')) {
      return authHandler(req, res);
    }
    
    if (path.startsWith('/api/v1/chat/')) {
      return chatHandler(req, res);
    }
    
    if (path.startsWith('/api/v1/brain/')) {
      return brainHandler(req, res);
    }
    
    if (path.startsWith('/api/v1/automation/')) {
      return automationHandler(req, res);
    }

    // Health check
    if (path === '/api/health') {
      return res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        environment: config.NODE_ENV
      });
    }

    return res.status(404).json({
      error: 'Not Found',
      message: `API route ${path} not found`
    });

  } catch (error) {
    console.error('API Error:', error);
    return errorHandler(error, req, res);
  }
}