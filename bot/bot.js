const { Telegraf, Markup } = require('telegraf');
const axios = require('axios');
require('dotenv').config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const API_BASE_URL = 'http://localhost:3000';

// In-memory state management
const userState = {};

// Helper to get or initialize state
const getState = (userId) => {
    if (!userState[userId]) {
        userState[userId] = {
            mode: 'menu',
            data: null
        };
    }
    return userState[userId];
};

// Command /start
bot.start((ctx) => {
    const userId = ctx.from.id;
    userState[userId] = { mode: 'menu' };
    
    ctx.reply(
        'Welcome to the Placement Prep Bot! 🚀\nChoose an option from the menu below:',
        Markup.inlineKeyboard([
            [Markup.button.callback('Daily Questions', 'daily')],
            [Markup.button.callback('Company Prep', 'company')],
            [Markup.button.callback('Resume Review', 'resume')],
            [Markup.button.callback('Mock Interview', 'interview')]
        ])
    );
});

// Command /daily
bot.command('daily', async (ctx) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/daily`);
        const { success, data, error } = response.data;

        if (success) {
            ctx.reply(`📅 Daily Questions:\n\n**Aptitude**: ${data.aptitude}\n**Coding**: ${data.coding}`, {
                parse_mode: 'Markdown'
            });
        } else {
            ctx.reply(`❌ Error: ${error}`);
        }
    } catch (err) {
        ctx.reply('❌ System error occurred while fetching daily questions.');
    }
});

// Command /company
bot.command('company', (ctx) => {
    ctx.reply('Select a company to prepare for:', Markup.inlineKeyboard([
        [Markup.button.callback('TCS', 'comp_tcs')],
        [Markup.button.callback('Infosys', 'comp_infosys')],
        [Markup.button.callback('Startup', 'comp_startup')]
    ]));
});

// Command /resume
bot.command('resume', (ctx) => {
    const userId = ctx.from.id;
    userState[userId] = { mode: 'waiting_for_resume' };
    ctx.reply('Please send your resume text here for analysis.');
});

// Command /interview
bot.command('interview', async (ctx) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/interview`);
        const { success, data, error } = response.data;

        if (success) {
            const userId = ctx.from.id;
            userState[userId] = { mode: 'interview', currentQuestion: data.question };
            
            ctx.reply(`🎤 Interview Question:\n\n${data.question}`, Markup.inlineKeyboard([
                [Markup.button.callback('Show Answer', 'show_answer')],
                [Markup.button.callback('Next Question', 'next_interview')]
            ]));
        } else {
            ctx.reply(`❌ Error: ${error}`);
        }
    } catch (err) {
        ctx.reply('❌ System error occurred while starting the interview.');
    }
});

// Callback Handlers for Menu
bot.action('daily', async (ctx) => {
    await ctx.answerCbQuery();
    return ctx.reply('Fetching daily questions...').then(() => {
        // We can reuse the command logic by triggering it or defining a function
        return fetchDailyQuestions(ctx);
    });
});

bot.action('company', async (ctx) => {
    await ctx.answerCbQuery();
    return ctx.reply('Select a company to prepare for:', Markup.inlineKeyboard([
        [Markup.button.callback('TCS', 'comp_tcs')],
        [Markup.button.callback('Infosys', 'comp_infosys')],
        [Markup.button.callback('Startup', 'comp_startup')]
    ]));
});

bot.action('resume', async (ctx) => {
    await ctx.answerCbQuery();
    const userId = ctx.from.id;
    userState[userId] = { mode: 'waiting_for_resume' };
    return ctx.reply('Please send your resume text here for analysis.');
});

bot.action('interview', async (ctx) => {
    await ctx.answerCbQuery();
    return startInterview(ctx);
});

// Company selection handler
bot.action(/comp_(.+)/, async (ctx) => {
    const company = ctx.match[1].toUpperCase();
    await ctx.answerCbQuery();
    ctx.reply(`Prep started for ${company}. Fetching details...`);
    // Team will handle the backend integration here
});

// Interview interaction handlers
bot.action('show_answer', async (ctx) => {
    await ctx.answerCbQuery();
    ctx.reply('Answer: [Feature to be implemented by Question Engine team]');
});

bot.action('next_interview', async (ctx) => {
    await ctx.answerCbQuery();
    return startInterview(ctx);
});

// Helper Functions
async function fetchDailyQuestions(ctx) {
    try {
        const response = await axios.get(`${API_BASE_URL}/daily`);
        const { success, data, error } = response.data;

        if (success) {
            return ctx.reply(`📅 Daily Questions:\n\n**Aptitude**: ${data.aptitude}\n**Coding**: ${data.coding}`, {
                parse_mode: 'Markdown'
            });
        }
        return ctx.reply(`❌ Error: ${error}`);
    } catch (err) {
        return ctx.reply('❌ System error occurred while fetching daily questions.');
    }
}

async function startInterview(ctx) {
    try {
        const response = await axios.get(`${API_BASE_URL}/interview`);
        const { success, data, error } = response.data;

        if (success) {
            const userId = ctx.from.id;
            userState[userId] = { mode: 'interview', currentQuestion: data.question };
            
            return ctx.reply(`🎤 Interview Question:\n\n${data.question}`, Markup.inlineKeyboard([
                [Markup.button.callback('Show Answer', 'show_answer')],
                [Markup.button.callback('Next Question', 'next_interview')]
            ]));
        }
        return ctx.reply(`❌ Error: ${error}`);
    } catch (err) {
        return ctx.reply('❌ System error occurred while starting the interview.');
    }
}

// Update Commands to use helpers
bot.command('daily', fetchDailyQuestions);
bot.command('interview', startInterview);

// Text listener for state-based interactions (Resume text)
bot.on('text', async (ctx) => {
    const userId = ctx.from.id;
    const state = getState(userId);

    if (state.mode === 'waiting_for_resume' && !ctx.message.text.startsWith('/')) {
        const resumeText = ctx.message.text;
        ctx.reply('✅ Resume received. Analyzing your profile...');
        // Here the AI service would be called by the team
        userState[userId].mode = 'menu';
    } else if (!ctx.message.text.startsWith('/')) {
        ctx.reply('I didn\'t understand that. Type /start to see the menu.');
    }
});

module.exports = bot;
