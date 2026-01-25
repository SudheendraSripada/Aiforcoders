import { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../../config/env.config';

const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);

export async function brainHandler(req: VercelRequest, res: VercelResponse) {
  const { method, url } = req;
  const path = url?.split('?')[0];

  try {
    switch (path) {
      case '/api/v1/brain/analyze':
        if (method === 'POST') {
          return await handleAnalyze(req, res);
        }
        break;
        
      case '/api/v1/brain/explain':
        if (method === 'POST') {
          return await handleExplain(req, res);
        }
        break;
        
      case '/api/v1/brain/refactor':
        if (method === 'POST') {
          return await handleRefactor(req, res);
        }
        break;
        
      default:
        return res.status(404).json({
          error: 'Not Found',
          message: 'Brain endpoint not found'
        });
    }
  } catch (error) {
    console.error('Brain handler error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Brain operation failed'
    });
  }
}

async function handleAnalyze(req: VercelRequest, res: VercelResponse) {
  const { code, language, analysisType = 'general' } = req.body;

  if (!code) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Code is required'
    });
  }

  try {
    const modelInstance = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `
Analyze the following ${language || 'code'} and provide insights on:

${analysisType === 'security' ? '- Security vulnerabilities\n- Potential security risks\n- Best practices for security' : 
analysisType === 'performance' ? '- Performance bottlenecks\n- Optimization opportunities\n- Scalability concerns' :
'- Code quality and structure\n- Potential bugs or issues\n- Best practices compliance\n- Maintainability'}

Code to analyze:
\`\`\`${language || 'code'}
${code}
\`\`\`

Provide a detailed analysis with:
1. Summary of findings
2. Specific issues identified
3. Recommendations for improvement
4. Code examples where applicable
`;

    const result = await modelInstance.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return res.status(200).json({
      success: true,
      analysis: {
        type: analysisType,
        language: language || 'unknown',
        findings: text,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Gemini API error:', error);
    return res.status(500).json({
      error: 'AI Service Error',
      message: 'Failed to analyze code'
    });
  }
}

async function handleExplain(req: VercelRequest, res: VercelResponse) {
  const { code, language, detailLevel = 'medium' } = req.body;

  if (!code) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Code is required'
    });
  }

  try {
    const modelInstance = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const detailInstruction = {
      'simple': 'Explain in simple terms suitable for beginners',
      'medium': 'Provide a balanced explanation for intermediate developers',
      'detailed': 'Give a comprehensive explanation with technical details'
    }[detailLevel] || 'Provide a balanced explanation';

    const prompt = `
${detailInstruction}

Explain what this ${language || 'code'} does:

\`\`\`${language || 'code'}
${code}
\`\`\`

Please provide:
1. High-level overview
2. Step-by-step explanation
3. Key concepts and patterns used
4. Potential improvements or alternatives
`;

    const result = await modelInstance.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return res.status(200).json({
      success: true,
      explanation: {
        code,
        language: language || 'unknown',
        detailLevel,
        explanation: text,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Gemini API error:', error);
    return res.status(500).json({
      error: 'AI Service Error',
      message: 'Failed to explain code'
    });
  }
}

async function handleRefactor(req: VercelRequest, res: VercelResponse) {
  const { code, language, refactorType = 'general', constraints = [] } = req.body;

  if (!code) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Code is required'
    });
  }

  try {
    const modelInstance = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const constraintText = constraints.length > 0 ? `\n\nConstraints to follow:\n${constraints.map((c: string) => `- ${c}`).join('\n')}` : '';
    
    const prompt = `
Refactor the following ${language || 'code'} with focus on ${refactorType}.

${constraintText}

Original code:
\`\`\`${language || 'code'}
${code}
\`\`\`

Provide:
1. Refactored code with improvements
2. Summary of changes made
3. Benefits of the refactoring
4. Alternative approaches considered
`;

    const result = await modelInstance.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return res.status(200).json({
      success: true,
      refactor: {
        original: code,
        language: language || 'unknown',
        type: refactorType,
        refactored: text,
        constraints,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Gemini API error:', error);
    return res.status(500).json({
      error: 'AI Service Error',
      message: 'Failed to refactor code'
    });
  }
}