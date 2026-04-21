const express = require('express');
const router = express.Router();
const { getRandomQuestion } = require('../services/questionService');

// GET /daily - Get daily question
router.get('/', (req, res) => {
  try {
    const question = getRandomQuestion();

    if (!question) {
      return res.status(404).json({
        success: false,
        data: null,
        error: 'No questions available',
      });
    }

    return res.status(200).json({
      success: true,
      data: question,
      error: null,
    });
  } catch (error) {
    console.error('Daily route error:', error.message);
    return res.status(500).json({
      success: false,
      data: null,
      error: 'Failed to fetch daily question',
    });
  }
});

module.exports = router;
