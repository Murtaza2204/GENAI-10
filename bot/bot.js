const { Telegraf } = require('telegraf');
const axios = require('axios');
const pdfParse = require('pdf-parse');
const { getResumeFeedback, getInterviewFeedback, generatePracticeQuestion, generateInterviewQuestion } = require('../services/aiService');

const API_BASE_URL = process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
const userState = new Map();

if (!process.env.TELEGRAM_BOT_TOKEN) {
  console.warn('TELEGRAM_BOT_TOKEN is missing, Telegram bot is disabled');
  module.exports = {
    launch: async () => {},
    stop: () => {},
  };
  return;
}

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Start command
bot.start((ctx) => {
  ctx.reply('Welcome to Placement Prep Bot! 🎯\n\n' +
    'Use /help to see available commands.');
});

// Help command
bot.help((ctx) => {
  ctx.reply(
    'Available commands:\n' +
    '/resume - Get resume feedback\n' +
    '/interview - Practice interviews\n' +
    '/daily - Daily preparation tips\n' +
    '/companies - View top companies\n' +
    'Type /help for more info'
  );
});

// Resume feedback
bot.command('resume', async (ctx) => {
  userState.set(ctx.from.id, { mode: 'resume' });
  ctx.reply('Send your resume as a PDF file and I will analyze it.');
});

// Interview feedback
bot.command('interview', async (ctx) => {
  try {
    const question = await generateInterviewQuestion();
    userState.set(ctx.from.id, { mode: 'interview', question });
    ctx.reply(
      `Question (${question.category} | ${question.difficulty}):\n\n${question.question}\n\n` +
      `Reply with your answer in text.`
    );
  } catch (error) {
    ctx.reply('Error generating interview question');
  }
});

// Daily question
bot.command('daily', async (ctx) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/daily`);
    if (response.data.success) {
      const q = response.data.data;
      ctx.reply(
        `📝 Daily Question (${q.difficulty}):\n\n${q.question}\n\n` +
        `Category: ${q.category}\nTags: ${q.tags.join(', ')}`
      );
    }
  } catch (error) {
    ctx.reply('Error fetching daily question');
  }
});

// Companies
bot.command('companies', async (ctx) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/company`);
    if (response.data.success) {
      const companies = response.data.data;
      const list = companies.map(c => `${c.name} (${c.industry})`).join('\n');
      ctx.reply(`🏢 Top Companies:\n\n${list}`);
    }
  } catch (error) {
    ctx.reply('Error fetching companies');
  }
});

bot.on('document', async (ctx) => {
  const state = userState.get(ctx.from.id);
  if (!state || state.mode !== 'resume') {
    return ctx.reply('Use /resume first, then send a PDF file.');
  }

  try {
    const file = ctx.message.document;
    if (file.mime_type !== 'application/pdf') {
      return ctx.reply('Please send a PDF file.');
    }

    const link = await ctx.telegram.getFileLink(file.file_id);
    const response = await axios.get(link.href, { responseType: 'arraybuffer' });
    const parsed = await pdfParse(Buffer.from(response.data));
    const feedback = await getResumeFeedback(parsed.text);

    userState.delete(ctx.from.id);

    ctx.reply(
      `Resume analysis:\n\n` +
      `Strengths: ${feedback.strengths.join('; ')}\n` +
      `Weaknesses: ${feedback.weaknesses.join('; ')}\n` +
      `Suggestions: ${feedback.suggestions.join('; ')}\n` +
      `Missing keywords: ${feedback.missingKeywords.join('; ')}`
    );
  } catch (error) {
    ctx.reply('Error analyzing resume PDF');
  }
});

bot.on('text', async (ctx) => {
  const state = userState.get(ctx.from.id);
  if (!state || state.mode !== 'interview') {
    return;
  }

  try {
    const feedback = await getInterviewFeedback(state.question.question, ctx.message.text);
    userState.delete(ctx.from.id);

    ctx.reply(
      `Feedback:\n\n${feedback.feedback}\n\n` +
      `Score: ${feedback.score}/10\n` +
      `Tips: ${feedback.improvementTips.join('; ')}`
    );
  } catch (error) {
    ctx.reply('Error analyzing your answer');
  }
});

module.exports = bot;
