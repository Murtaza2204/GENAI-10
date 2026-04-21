# Telegram Placement Prep Bot MVP

An AI-powered Telegram bot to help users prepare for job placements with resume feedback, interview practice, and daily questions.

## Project Structure

```
GENAI-10/
├── app.js                 # Main Express server
├── package.json           # Dependencies
├── .env                   # Environment variables
├── bot/
│   └── bot.js             # Telegram bot setup
├── routes/
│   ├── resume.js          # Resume feedback endpoint
│   ├── interview.js       # Interview feedback endpoint
│   ├── daily.js           # Daily questions endpoint
│   └── company.js         # Companies list endpoint
├── services/
│   ├── aiService.js       # OpenAI API integration
│   └── questionService.js # Question management
└── data/
    ├── questions.json     # Interview questions database
    └── companies.json     # Target companies database
```

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Update `.env` file with your credentials:
```
OPENAI_API_KEY=your_openai_api_key_here
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
API_BASE_URL=https://your-public-domain.com
PORT=3000
```

### 3. Start the Server
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### 1. Resume Feedback
**POST** `/resume`

Request:
```json
{
  "text": "resume content here"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "strengths": ["..."],
    "weaknesses": ["..."],
    "suggestions": ["..."],
    "missingKeywords": ["..."]
  },
  "error": null
}
```

### 2. Interview Feedback
**POST** `/interview`

Request:
```json
{
  "question": "Tell me about yourself",
  "answer": "your answer here"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "feedback": "assessment here",
    "improvementTips": ["..."],
    "score": 7
  },
  "error": null
}
```

### 3. Daily Question
**GET** `/daily`

Response:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "category": "behavioral",
    "question": "...",
    "difficulty": "medium",
    "tags": ["teamwork", "communication"]
  },
  "error": null
}
```

### 4. Companies List
**GET** `/company`

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Google",
      "industry": "Technology",
      "difficulty": "hard",
      "focusAreas": ["DSA", "System Design"]
    }
  ],
  "error": null
}
```

## Features Implemented

- ✅ **Resume Feedback**: AI-powered analysis of resume strengths, weaknesses, suggestions, and missing keywords
- ✅ **Interview Feedback**: AI-powered interview response evaluation with score (1-10)
- ✅ **Daily Questions**: Random interview questions with difficulty levels
- ✅ **Companies Database**: Curated list of target companies with focus areas
- ✅ **Telegram Bot**: Commands for accessing all features via Telegram
- ✅ **Structured API Responses**: All endpoints follow consistent response format
- ✅ **Error Handling**: Comprehensive error handling across all services

## Telegram Bot Commands

- `/start` - Welcome message
- `/help` - Show available commands
- `/resume` - Get resume feedback
- `/interview` - Practice interviews
- `/daily` - Get daily question
- `/companies` - View target companies

## API Response Format

All endpoints follow this structure:

**Success:**
```json
{
  "success": true,
  "data": { /* response data */ },
  "error": null
}
```

**Error:**
```json
{
  "success": false,
  "data": null,
  "error": "Error message"
}
```

## Technologies Used

- **Node.js & Express**: REST API server
- **Telegraf**: Telegram bot framework
- **OpenAI API**: AI-powered feedback generation
- **JSON**: Simple file-based storage
- **CommonJS**: Module system

## Development Notes

- All code uses CommonJS (require/module.exports)
- No TypeScript, kept modular and clean
- Centralized OpenAI calls in `aiService.js`
- JSON files used for persistent storage
- Error handling on all routes and services

## Testing the Resume Endpoint

```bash
curl -X POST http://localhost:3000/resume \
  -H "Content-Type: application/json" \
  -d '{"text":"Your resume text here"}'
```

## Testing the Interview Endpoint

```bash
curl -X POST http://localhost:3000/interview \
  -H "Content-Type: application/json" \
  -d '{"question":"Tell me about yourself","answer":"Your answer here"}'
```

## Next Steps

1. Add Telegram conversation middleware for better user interaction flow
2. Implement user progress tracking
3. Add more interview questions and company profiles
4. Implement caching for frequently accessed data
5. Add analytics and metrics tracking
