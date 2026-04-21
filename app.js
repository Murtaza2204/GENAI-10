require('dotenv').config();
const express = require('express');
const resumeRoutes = require('./routes/resume');
const interviewRoutes = require('./routes/interview');
const dailyRoutes = require('./routes/daily');
const companyRoutes = require('./routes/company');
const bot = require('./bot/bot');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/resume', resumeRoutes);
app.use('/interview', interviewRoutes);
app.use('/daily', dailyRoutes);
app.use('/company', companyRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    data: { status: 'Server is running' },
    error: null,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    data: null,
    error: 'Route not found',
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    data: null,
    error: 'Internal server error',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Start Telegram bot
bot.launch();
console.log('Telegram bot started');

// Handle shutdown
process.on('SIGINT', () => {
  bot.stop();
  process.exit(0);
});
