const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const recentPracticeQuestions = [];
const RECENT_QUESTION_LIMIT = 12;
let nextInterviewCategory = 'dsa';

// Centralized function to call OpenAI API
async function callOpenAI(prompt, maxTokens = 300, options = {}) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert career coach and interview preparation specialist. Provide clear, actionable feedback.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: maxTokens,
      temperature: 0.7,
      ...options,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error.message);
    throw new Error('Failed to get AI feedback');
  }
}

// Resume feedback function
async function getResumeFeedback(resumeText) {
  const prompt = `Analyze this resume and provide feedback in JSON format:
${resumeText}

Return a JSON object with these fields (keep responses under 150 words total):
{
  "strengths": ["list of strengths"],
  "weaknesses": ["list of weaknesses"],
  "suggestions": ["actionable suggestions"],
  "missingKeywords": ["important keywords that should be added"]
}`;

  try {
    const response = await callOpenAI(prompt, 400);
    // Extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('Invalid response format');
  } catch (error) {
    console.error('Resume feedback error:', error.message);
    throw error;
  }
}

// Interview feedback function
async function getInterviewFeedback(question, answer) {
  const prompt = `Evaluate this interview response:
Question: ${question}
Answer: ${answer}

Provide feedback in JSON format (keep responses under 150 words):
{
  "feedback": "overall assessment of the answer",
  "improvementTips": ["specific tips to improve"],
  "score": 7
}

Score should be 1-10. Return ONLY valid JSON.`;

  try {
    const response = await callOpenAI(prompt, 300);
    // Extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('Invalid response format');
  } catch (error) {
    console.error('Interview feedback error:', error.message);
    throw error;
  }
}

function rememberPracticeQuestion(question) {
  if (!question) {
    return;
  }

  recentPracticeQuestions.push(question);

  while (recentPracticeQuestions.length > RECENT_QUESTION_LIMIT) {
    recentPracticeQuestions.shift();
  }
}

function buildRecentQuestionBlock() {
  return recentPracticeQuestions.length > 0
    ? recentPracticeQuestions.map((item, index) => `${index + 1}. ${item}`).join('\n')
    : 'None yet';
}

async function generatePracticeQuestion() {
  const recentList = buildRecentQuestionBlock();

  const prompt = `Generate one NEW placement question in JSON format.

Do not repeat any of these recent questions:
${recentList}

Return ONLY valid JSON with these fields:
{
  "category": "technical or behavioral",
  "question": "one clear question",
  "difficulty": "easy, medium, or hard",
  "tags": ["2 to 4 short tags"]
}

Rules:
- Ask a fresh question that is meaningfully different from the recent list.
- Prefer variety across topics.
- Keep the question concise and practical.`;

  try {
    const response = await callOpenAI(prompt, 120, {
      temperature: 1,
      presence_penalty: 0.8,
      frequency_penalty: 0.4,
    });
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const question = JSON.parse(jsonMatch[0]);
      rememberPracticeQuestion(question.question);
      return question;
    }
    throw new Error('Invalid response format');
  } catch (error) {
    console.error('Question generation error:', error.message);
    throw error;
  }
}

async function generateInterviewQuestion() {
  const recentList = recentPracticeQuestions.length > 0
    ? recentPracticeQuestions.map((item, index) => `${index + 1}. ${item}`).join('\n')
    : 'None yet';

  const category = nextInterviewCategory;
  nextInterviewCategory = nextInterviewCategory === 'dsa' ? 'hr' : 'dsa';
  const categoryLabel = category === 'dsa' ? 'DSA' : 'HR';

  const prompt = `Generate one NEW ${categoryLabel} interview question in JSON format.

Do not repeat any of these recent questions:
${recentList}

Return ONLY valid JSON with these fields:
{
  "category": "${categoryLabel}",
  "question": "one clear interview question",
  "difficulty": "easy, medium, or hard",
  "tags": ["2 to 4 short tags"]
}

Rules:
- Ask a fresh question that is meaningfully different from the recent list.
- Stay focused on ${categoryLabel} interview style.
- Prefer variety across topics.
- Keep the question concise and practical.`;

  try {
    const response = await callOpenAI(prompt, 120, {
      temperature: 1,
      presence_penalty: 0.8,
      frequency_penalty: 0.4,
    });
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const question = JSON.parse(jsonMatch[0]);
      rememberPracticeQuestion(question.question);
      return question;
    }
    throw new Error('Invalid response format');
  } catch (error) {
    console.error('Question generation error:', error.message);
    throw error;
  }
}

module.exports = {
  callOpenAI,
  getResumeFeedback,
  getInterviewFeedback,
  generatePracticeQuestion,
  generateInterviewQuestion,
};
