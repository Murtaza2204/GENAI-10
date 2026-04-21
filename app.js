const express = require('express');
const dotenv = require('dotenv');
const bot = require('./bot/bot');

dotenv.config();

const app = express();
app.use(express.json());

// Mock API endpoints to support bot testing
app.get('/daily', (req, res) => {
  res.json({
    success: true,
    data: {
      aptitude: "What is 2+2?",
      coding: "Write a function to add two numbers."
    },
    error: null
  });
});

app.get('/interview', (req, res) => {
  res.json({
    success: true,
    data: {
      question: "Tell me about yourself."
    },
    error: null
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // bot.launch(); // We'll handle bot launch in bot.js or here
});
