const express = require('express');
const router = express.Router();
const { getDailyQuestions, getQuestionById } = require('../services/questionService');

router.get('/', (req, res) => {
  try {
    const data = getDailyQuestions();
    if (!data.aptitude || !data.coding) {
      return res.json({
        success: false,
        data: null,
        error: "Insufficient questions available"
      });
    }
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

router.get('/question/:id', (req, res) => {
  try {
    const { id } = req.params;
    const question = getQuestionById(id);
    if (!question) {
      return res.json({
        success: false,
        data: null,
        error: "Question not found"
      });
    }
    res.json({
      success: true,
      data: {
        answer: question.answer,
        explanation: question.explanation
      },
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