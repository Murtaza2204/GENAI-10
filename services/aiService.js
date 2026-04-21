const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Centralized function to call OpenAI API
async function callOpenAI(prompt, maxTokens = 300) {
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

module.exports = {
  callOpenAI,
  getResumeFeedback,
  getInterviewFeedback,
};
