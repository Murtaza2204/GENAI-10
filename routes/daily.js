const express = require('express');
const router = express.Router();
const { getDailyQuestions } = require('../services/questionService');

router.get('/', (req, res) => {
  try {
    const data = getDailyQuestions();
    res.json({
      success: true,
      data,
      error: null
    });
  } catch (error) {
    res.json({
      success: false,
      data: null,
      error: error.message
    });
  }
});

module.exports = router;