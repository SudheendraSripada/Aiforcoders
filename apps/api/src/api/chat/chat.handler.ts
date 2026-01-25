import { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../../config/env.config';

const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);

export async function chatHandler(req: VercelRequest, res: VercelResponse) {
  const { method, url } = req;
  const path = url?.split('?')[0];

  try {
    switch (path) {
      case '/api/v1/chat/message':
        if (method === 'POST') {
          return await handleMessage(req, res);
        }
        break;
        
      case '/api/v1/chat/history':
        if (method === 'GET') {
          return await handleHistory(req, res);
        }
        if (method === 'POST') {
          return await handleSaveHistory(req, res);
        }
        break;
        
      default:
        return res.status(404).json({
          error: 'Not Found',
          message: 'Chat endpoint not found'
        });
    }
  } catch (error) {
    console.error('Chat handler error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Chat operation failed'
    });
  }
}

async function handleMessage(req: VercelRequest, res: VercelResponse) {
  const { message, history, model = 'gemini-pro', temperature = 0.7 } = req.body;

  if (!message) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Message is required'
    });
  }

  try {
    const modelInstance = genAI.getGenerativeModel({ model });
    
    // Convert history to Gemini format
    const geminiHistory = history?.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    })) || [];

    const chat = modelInstance.startChat({
      history: geminiHistory,
      generationConfig: {
        temperature,
        maxOutputTokens: 2048,
      },
    });

    const result = await chat.sendMessage(message);
    const response = result.response;
    const text = response.text();

    return res.status(200).json({
      success: true,
      message: {
        role: 'assistant',
        content: text,
        timestamp: new Date().toISOString()
      },
      usage: {
        promptTokens: result.usageMetadata?.promptTokenCount,
        completionTokens: result.usageMetadata?.candidatesTokenCount,
        totalTokens: result.usageMetadata?.totalTokenCount
      }
    });

  } catch (error) {
    console.error('Gemini API error:', error);
    return res.status(500).json({
      error: 'AI Service Error',
      message: 'Failed to generate response'
    });
  }
}

async function handleHistory(req: VercelRequest, res: VercelResponse) {
  const { userId } = req.query;

  // TODO: Implement actual history retrieval from database
  // For now, return empty history
  return res.status(200).json({
    success: true,
    history: [],
    userId
  });
}

async function handleSaveHistory(req: VercelRequest, res: VercelResponse) {
  const { userId, history } = req.body;

  if (!userId || !history) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'userId and history are required'
    });
  }

  // TODO: Implement actual history saving to database
  return res.status(200).json({
    success: true,
    message: 'History saved successfully',
    userId
  });
}