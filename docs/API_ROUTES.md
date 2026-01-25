# API Routes Documentation

This document provides comprehensive documentation for all API endpoints in the AI for Coders backend.

## Base URL

```
Production: https://api.aiforcoders.vercel.app
Development: http://localhost:3000
```

## Authentication

Most endpoints require a valid API key in the `Authorization` header:
```
Authorization: Bearer YOUR_GEMINI_API_KEY
```

## Common Response Format

All API responses follow a consistent format:

```typescript
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    timestamp: string;
    requestId?: string;
  };
}
```

## Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `INVALID_API_KEY` | 401 | API key is missing or invalid |
| `NETWORK_ERROR` | 503 | External service unavailable |
| `TIMEOUT_ERROR` | 408 | Request timed out |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INVALID_REQUEST` | 400 | Request format is invalid |
| `QUOTA_EXCEEDED` | 429 | API quota exceeded |
| `UNAUTHORIZED` | 401 | Authentication required |
| `NOT_FOUND` | 404 | Endpoint not found |
| `INTERNAL_ERROR` | 500 | Server error |

## Health Check

### GET /api/health

Check API health status.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-25T10:30:00.000Z",
  "version": "1.0.0",
  "environment": "production"
}
```

## Authentication Endpoints

### POST /api/v1/auth/pair

Pair a new device with the system.

**Request Body:**
```json
{
  "code": "string",
  "deviceId": "string"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt-token-here",
  "expiresIn": "24h",
  "deviceId": "device-123",
  "timestamp": "2024-01-25T10:30:00.000Z"
}
```

**Example:**
```bash
curl -X POST https://api.aiforcoders.vercel.app/api/v1/auth/pair \
  -H "Content-Type: application/json" \
  -d '{
    "code": "PAIR123",
    "deviceId": "device-456"
  }'
```

### POST /api/v1/auth/verify

Verify an authentication token.

**Request Body:**
```json
{
  "token": "string"
}
```

**Response:**
```json
{
  "success": true,
  "valid": true,
  "timestamp": "2024-01-25T10:30:00.000Z"
}
```

**Example:**
```bash
curl -X POST https://api.aiforcoders.vercel.app/api/v1/auth/verify \
  -H "Content-Type: application/json" \
  -d '{
    "token": "jwt-token-here"
  }'
```

## Chat Endpoints

### POST /api/v1/chat/message

Send a message to the AI chat system.

**Request Body:**
```json
{
  "message": "string",
  "history": [
    {
      "role": "user" | "assistant" | "system",
      "content": "string",
      "timestamp": "string"
    }
  ],
  "model": "gemini-pro",
  "temperature": 0.7
}
```

**Response:**
```json
{
  "success": true,
  "message": {
    "role": "assistant",
    "content": "AI response here...",
    "timestamp": "2024-01-25T10:30:00.000Z"
  },
  "usage": {
    "promptTokens": 150,
    "completionTokens": 200,
    "totalTokens": 350
  }
}
```

**Example:**
```bash
curl -X POST https://api.aiforcoders.vercel.app/api/v1/chat/message \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_GEMINI_API_KEY" \
  -d '{
    "message": "Explain TypeScript interfaces",
    "model": "gemini-pro",
    "temperature": 0.7
  }'
```

### GET /api/v1/chat/history

Retrieve chat history for a user.

**Query Parameters:**
- `userId` (string, required): User identifier

**Response:**
```json
{
  "success": true,
  "history": [
    {
      "id": "chat-123",
      "title": "TypeScript Help",
      "messages": [
        {
          "role": "user",
          "content": "What are interfaces?",
          "timestamp": "2024-01-25T10:00:00.000Z"
        },
        {
          "role": "assistant",
          "content": "Interfaces in TypeScript...",
          "timestamp": "2024-01-25T10:00:01.000Z"
        }
      ],
      "createdAt": "2024-01-25T10:00:00.000Z",
      "updatedAt": "2024-01-25T10:30:00.000Z"
    }
  ],
  "userId": "user-456"
}
```

**Example:**
```bash
curl "https://api.aiforcoders.vercel.app/api/v1/chat/history?userId=user-456" \
  -H "Authorization: Bearer YOUR_GEMINI_API_KEY"
```

### POST /api/v1/chat/history

Save chat history for a user.

**Request Body:**
```json
{
  "userId": "string",
  "history": [
    {
      "id": "string",
      "title": "string",
      "messages": ChatMessage[],
      "createdAt": "string",
      "updatedAt": "string"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "History saved successfully",
  "userId": "user-456"
}
```

**Example:**
```bash
curl -X POST https://api.aiforcoders.vercel.app/api/v1/chat/history \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_GEMINI_API_KEY" \
  -d '{
    "userId": "user-456",
    "history": [...]
  }'
```

## Brain Analysis Endpoints

### POST /api/v1/brain/analyze

Analyze code for quality, security, or performance issues.

**Request Body:**
```json
{
  "code": "string",
  "language": "typescript" | "javascript" | "python" | "java" | "cpp" | "c" | "go" | "rust" | "php" | "ruby" | "swift" | "kotlin" | "scala" | "html" | "css" | "scss" | "sass" | "json" | "yaml" | "xml" | "sql" | "markdown" | "bash",
  "analysisType": "general" | "security" | "performance" | "accessibility"
}
```

**Response:**
```json
{
  "success": true,
  "analysis": {
    "type": "security",
    "language": "typescript",
    "findings": "## Security Analysis\n\n### Issues Found:\n1. **Potential SQL Injection** (Line 15)\n   - Raw SQL query construction detected\n   - Use parameterized queries instead\n\n2. **Missing Input Validation** (Line 8)\n   - User input is not validated\n   - Implement proper validation\n\n### Recommendations:\n- Use ORM with parameterized queries\n- Implement input sanitization\n- Add CSRF protection\n\n### Code Examples:\n```typescript\n// Instead of:\nconst query = `SELECT * FROM users WHERE id = ${userId}`;\n\n// Use:\nconst query = 'SELECT * FROM users WHERE id = ?';\ndb.execute(query, [userId]);\n```",
    "timestamp": "2024-01-25T10:30:00.000Z"
  }
}
```

**Example:**
```bash
curl -X POST https://api.aiforcoders.vercel.app/api/v1/brain/analyze \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_GEMINI_API_KEY" \
  -d '{
    "code": "function getUser(id) { return db.query(\"SELECT * FROM users WHERE id = \" + id); }",
    "language": "javascript",
    "analysisType": "security"
  }'
```

### POST /api/v1/brain/explain

Get detailed explanation of code functionality.

**Request Body:**
```json
{
  "code": "string",
  "language": "string",
  "detailLevel": "simple" | "medium" | "detailed"
}
```

**Response:**
```json
{
  "success": true,
  "explanation": {
    "code": "function fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}",
    "language": "javascript",
    "detailLevel": "medium",
    "explanation": "## Code Explanation\n\nThis JavaScript function implements the Fibonacci sequence using recursion.\n\n### How it works:\n1. **Base Case**: If n is 0 or 1, it returns n directly\n2. **Recursive Case**: For larger values, it calls itself twice\n3. **Summation**: Adds the results of fibonacci(n-1) and fibonacci(n-2)\n\n### Key Concepts:\n- **Recursion**: Function calls itself to solve smaller instances\n- **Base Case**: Prevents infinite recursion\n- **Time Complexity**: O(2^n) - exponential growth\n\n### Potential Issues:\n- Very inefficient for large n (no memoization)\n- Stack overflow risk for n > ~1000\n\n### Improvements:\n```javascript\n// Iterative approach (more efficient)\nfunction fibonacci(n) {\n  if (n <= 1) return n;\n  \n  let a = 0, b = 1;\n  for (let i = 2; i <= n; i++) {\n    [a, b] = [b, a + b];\n  }\n  return b;\n}\n```",
    "timestamp": "2024-01-25T10:30:00.000Z"
  }
}
```

**Example:**
```bash
curl -X POST https://api.aiforcoders.vercel.app/api/v1/brain/explain \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_GEMINI_API_KEY" \
  -d '{
    "code": "function fibonacci(n) { if (n <= 1) return n; return fibonacci(n - 1) + fibonacci(n - 2); }",
    "language": "javascript",
    "detailLevel": "medium"
  }'
```

### POST /api/v1/brain/refactor

Get refactored code with improvements.

**Request Body:**
```json
{
  "code": "string",
  "language": "string",
  "refactorType": "general" | "performance" | "readability" | "security" | "architecture",
  "constraints": ["string"]
}
```

**Response:**
```json
{
  "success": true,
  "refactor": {
    "original": "function fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}",
    "language": "javascript",
    "type": "performance",
    "refactored": "## Refactored Code\n\n### Iterative Approach (Performance Optimized)\n\n```javascript\n/**\n * Calculate Fibonacci number using iterative approach\n * Time Complexity: O(n)\n * Space Complexity: O(1)\n * @param {number} n - The position in the Fibonacci sequence\n * @returns {number} The Fibonacci number at position n\n */\nfunction fibonacci(n) {\n  if (n <= 1) return n;\n  \n  let a = 0, b = 1;\n  for (let i = 2; i <= n; i++) {\n    [a, b] = [b, a + b];\n  }\n  return b;\n}\n```\n\n### Memoized Approach (Even Better)\n\n```javascript\n/**\n * Calculate Fibonacci number using memoization\n * Time Complexity: O(n)\n * Space Complexity: O(n)\n */\nfunction fibonacciMemo(n, memo = {}) {\n  if (n <= 1) return n;\n  if (memo[n] !== undefined) return memo[n];\n  \n  memo[n] = fibonacciMemo(n - 1, memo) + fibonacciMemo(n - 2, memo);\n  return memo[n];\n}\n```\n\n## Summary of Changes\n\n1. **Performance**: Eliminated exponential time complexity O(2^n) → O(n)\n2. **Stack Safety**: Removed recursion to prevent stack overflow\n3. **Documentation**: Added JSDoc comments explaining complexity\n4. **Readability**: Clear variable names and structure\n5. **Options**: Provided both iterative and memoized versions\n\n## Benefits\n\n- **100x faster** for large values of n\n- **Memory efficient** (no recursion stack)\n- **Predictable behavior** with O(n) complexity\n- **Better suited** for production use\n\n## Alternative Approaches Considered\n\n- **Matrix Exponentiation**: O(log n) but complex\n- **Closed Form (Binet's)**: Floating point precision issues\n- **Dynamic Programming**: Similar to memoization",
    "constraints": [],
    "timestamp": "2024-01-25T10:30:00.000Z"
  }
}
```

**Example:**
```bash
curl -X POST https://api.aiforcoders.vercel.app/api/v1/brain/refactor \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_GEMINI_API_KEY" \
  -d '{
    "code": "function fibonacci(n) { if (n <= 1) return n; return fibonacci(n - 1) + fibonacci(n - 2); }",
    "language": "javascript",
    "refactorType": "performance"
  }'
```

## Automation Endpoints

### POST /api/v1/automation/capture

Analyze screenshots for UI issues and suggestions.

**Request Body:**
```json
{
  "screenshot": "base64-encoded-image-string",
  "context": "string",
  "type": "screen" | "element" | "full-page"
}
```

**Response:**
```json
{
  "success": true,
  "analysis": {
    "type": "screen",
    "context": "login-form",
    "findings": [
      {
        "element": "Email Input Field",
        "issue": "Missing ARIA label",
        "suggestion": "Add aria-label=\"Email address\" to the input element",
        "confidence": 0.95
      },
      {
        "element": "Submit Button",
        "issue": "Low color contrast",
        "suggestion": "Increase contrast ratio to meet WCAG AA standards (4.5:1)",
        "confidence": 0.87
      },
      {
        "element": "Password Field",
        "issue": "Missing password visibility toggle",
        "suggestion": "Add a show/hide password button for better UX",
        "confidence": 0.78
      }
    ],
    "timestamp": "2024-01-25T10:30:00.000Z"
  }
}
```

**Example:**
```bash
curl -X POST https://api.aiforcoders.vercel.app/api/v1/automation/capture \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_GEMINI_API_KEY" \
  -d '{
    "screenshot": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "context": "login-form",
    "type": "screen"
  }'
```

### POST /api/v1/automation/apply-fix

Apply automated fixes to code based on identified issues.

**Request Body:**
```json
{
  "issue": "string",
  "currentCode": "string",
  "fixType": "automated" | "guided" | "manual"
}
```

**Response:**
```json
{
  "success": true,
  "fix": {
    "issue": "SQL injection vulnerability",
    "currentCode": "function getUser(id) { return db.query(\"SELECT * FROM users WHERE id = \" + id); }",
    "fixType": "automated",
    "solution": "## Root Cause Analysis\n\nThe current code is vulnerable to SQL injection attacks because it directly concatenates user input into a SQL query string.\n\n## Suggested Fix\n\n### Implementation Steps:\n\n1. **Use Parameterized Queries**\n   Replace string concatenation with parameterized queries\n\n2. **Input Validation**\n   Validate that id is a valid number\n\n3. **Error Handling**\n   Add proper error handling for database operations\n\n### Refactored Code:\n\n```javascript\n/**\n * Get user by ID with SQL injection protection\n * @param {number} id - User ID\n * @returns {Promise<Object>} User object\n */\nasync function getUser(id) {\n  // Input validation\n  if (typeof id !== 'number' || !Number.isInteger(id) || id <= 0) {\n    throw new Error('Invalid user ID');\n  }\n\n  try {\n    // Use parameterized query to prevent SQL injection\n    const query = 'SELECT * FROM users WHERE id = ?';\n    const result = await db.execute(query, [id]);\n    \n    if (result.rows.length === 0) {\n      throw new Error('User not found');\n    }\n    \n    return result.rows[0];\n  } catch (error) {\n    // Log error but don't expose details to client\n    console.error('Database error:', error.message);\n    throw new Error('Failed to retrieve user');\n  }\n}\n```\n\n### Testing Recommendations:\n\n1. **Unit Tests**\n   - Test with valid ID\n   - Test with invalid ID types\n   - Test with SQL injection attempts\n   - Test error handling\n\n2. **Integration Tests**\n   - Database connection tests\n   - Query performance tests\n\n3. **Security Tests**\n   - SQL injection attempts\n   - Input boundary testing\n\n### Security Benefits:\n\n- **100% protection** against SQL injection\n- **Input validation** prevents malformed data\n- **Error handling** prevents information disclosure\n- **Type safety** with TypeScript\n\n### Alternative Approaches:\n\n1. **ORM with Query Builder**\n```javascript\n// Using an ORM like Sequelize or TypeORM\nconst user = await User.findOne({ where: { id } });\n```\n\n2. **Stored Procedures**\n```sql\nCREATE PROCEDURE GetUserById(IN user_id INT)\nBEGIN\n  SELECT * FROM users WHERE id = user_id;\nEND;\n```\n\nBoth alternatives provide additional layers of security and abstraction.",
    "timestamp": "2024-01-25T10:30:00.000Z"
  }
}
```

**Example:**
```bash
curl -X POST https://api.aiforcoders.vercel.app/api/v1/automation/apply-fix \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_GEMINI_API_KEY" \
  -d '{
    "issue": "SQL injection vulnerability in user query",
    "currentCode": "function getUser(id) { return db.query(\"SELECT * FROM users WHERE id = \" + id); }",
    "fixType": "automated"
  }'
```

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **Window**: 15 minutes
- **Limit**: 100 requests per window per IP
- **Headers**: 
  - `X-RateLimit-Limit`: Total allowed requests
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset timestamp

### Rate Limit Exceeded Response

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "timestamp": "2024-01-25T10:30:00.000Z"
  }
}
```

## CORS Configuration

The API supports CORS with the following origins in production:
- `https://aiforcoders.vercel.app`
- `https://*.vercel.app`

For development, additional origins are allowed:
- `http://localhost:3000`
- `http://localhost:4200`

## SDK Examples

### JavaScript/TypeScript

```typescript
class AICodersAPI {
  private baseURL: string;
  private apiKey: string;

  constructor(baseURL: string, apiKey: string) {
    this.baseURL = baseURL;
    this.apiKey = apiKey;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  async sendMessage(message: string, options?: {
    model?: string;
    temperature?: number;
    history?: any[];
  }) {
    return this.request('/api/v1/chat/message', {
      method: 'POST',
      body: JSON.stringify({
        message,
        ...options,
      }),
    });
  }

  async analyzeCode(code: string, language: string, analysisType = 'general') {
    return this.request('/api/v1/brain/analyze', {
      method: 'POST',
      body: JSON.stringify({
        code,
        language,
        analysisType,
      }),
    });
  }

  async explainCode(code: string, language: string, detailLevel = 'medium') {
    return this.request('/api/v1/brain/explain', {
      method: 'POST',
      body: JSON.stringify({
        code,
        language,
        detailLevel,
      }),
    });
  }
}

// Usage example
const api = new AICodersAPI('https://api.aiforcoders.vercel.app', 'YOUR_GEMINI_API_KEY');

try {
  const response = await api.sendMessage('Explain React hooks');
  console.log(response.message.content);
} catch (error) {
  console.error('Error:', error.message);
}
```

### Python

```python
import requests
import json
from typing import Optional, Dict, Any

class AICodersAPI:
    def __init__(self, base_url: str, api_key: str):
        self.base_url = base_url
        self.headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }

    def request(self, endpoint: str, method: str = 'GET', data: Optional[Dict] = None):
        url = f"{self.base_url}{endpoint}"
        
        response = requests.request(
            method=method,
            url=url,
            headers=self.headers,
            json=data
        )
        
        response.raise_for_status()
        return response.json()

    def send_message(self, message: str, **kwargs):
        return self.request('/api/v1/chat/message', 'POST', {
            'message': message,
            **kwargs
        })

    def analyze_code(self, code: str, language: str, analysis_type='general'):
        return self.request('/api/v1/brain/analyze', 'POST', {
            'code': code,
            'language': language,
            'analysisType': analysis_type
        })

    def explain_code(self, code: str, language: str, detail_level='medium'):
        return self.request('/api/v1/brain/explain', 'POST', {
            'code': code,
            'language': language,
            'detailLevel': detail_level
        })

# Usage example
api = AICodersAPI('https://api.aiforcoders.vercel.app', 'YOUR_GEMINI_API_KEY')

try:
    response = api.send_message('Explain Python decorators')
    print(response['message']['content'])
except requests.exceptions.RequestException as e:
    print(f'Error: {e}')
```

### cURL Examples

#### Basic Chat Message
```bash
curl -X POST https://api.aiforcoders.vercel.app/api/v1/chat/message \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_GEMINI_API_KEY" \
  -d '{
    "message": "Hello, can you help me with TypeScript?",
    "model": "gemini-pro",
    "temperature": 0.7
  }'
```

#### Code Analysis
```bash
curl -X POST https://api.aiforcoders.vercel.app/api/v1/brain/analyze \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_GEMINI_API_KEY" \
  -d '{
    "code": "const fs = require(\"fs\"); const data = fs.readFileSync(\"/etc/passwd\", \"utf8\");",
    "language": "javascript",
    "analysisType": "security"
  }'
```

#### Screenshot Analysis
```bash
curl -X POST https://api.aiforcoders.vercel.app/api/v1/automation/capture \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_GEMINI_API_KEY" \
  -d '{
    "screenshot": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "context": "web-form",
    "type": "screen"
  }'
```

## Support

For API support and questions:
- 📧 Email: api-support@aiforcoders.com
- 🐛 Issues: [GitHub Issues](https://github.com/SudheendraSripada/ai-for-coders-web/issues)
- 📖 Documentation: [API Reference](https://github.com/SudheendraSripada/ai-for-coders-web/wiki/API-Reference)

---

*Last updated: January 25, 2024*