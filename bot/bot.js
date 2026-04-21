const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const API_BASE_URL = `http://localhost:${process.env.PORT || 3000}`;

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
  ctx.reply('Please share your resume text. Send it as a message.');
});

// Interview feedback
bot.command('interview', async (ctx) => {
  ctx.reply('Share the interview question:');
});

// Daily question
bot.command('daily', async (ctx) => {
  try {
    const response = await require('axios').get(`${API_BASE_URL}/daily`);
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
    const response = await require('axios').get(`${API_BASE_URL}/company`);
    if (response.data.success) {
      const companies = response.data.data;
      const list = companies.map(c => `${c.name} (${c.industry})`).join('\n');
      ctx.reply(`🏢 Top Companies:\n\n${list}`);
    }
  } catch (error) {
    ctx.reply('Error fetching companies');
  }
});

module.exports = bot;
