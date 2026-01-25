import { VercelRequest, VercelResponse } from '@vercel/node';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

export function errorHandler(error: any, req: VercelRequest, res: VercelResponse) {
  console.error('Error:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Default error response
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';
  const code = error.code || 'INTERNAL_ERROR';

  const errorResponse: any = {
    success: false,
    error: {
      code,
      message,
      timestamp: new Date().toISOString()
    }
  };

  // Add request ID for tracking (if available)
  if (req.headers['x-request-id']) {
    errorResponse.error.requestId = req.headers['x-request-id'];
  }

  // Don't expose internal errors in production
  if (process.env.NODE_ENV === 'production' && statusCode === 500) {
    errorResponse.error.message = 'Something went wrong';
  }

  res.status(statusCode).json(errorResponse);
}

export function notFoundHandler(req: VercelRequest, res: VercelResponse) {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.url} not found`,
      timestamp: new Date().toISOString()
    }
  });
}

export function asyncHandler(fn: Function) {
  return (req: VercelRequest, res: VercelResponse, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export function createError(statusCode: number, message: string, code?: string): AppError {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  error.code = code || 'CUSTOM_ERROR';
  return error;
}