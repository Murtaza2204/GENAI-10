const express = require('express');
const router = express.Router();
const { getInterviewFeedback } = require('../services/aiService');

// POST /interview - Get interview feedback
router.post('/', async (req, res) => {
  try {
    const { question, answer } = req.body;

    // Validate input
    if (!question || question.trim() === '') {
      return res.status(400).json({
        success: false,
        data: null,
        error: 'Question is required',
      });
    }

    if (!answer || answer.trim() === '') {
      return res.status(400).json({
        success: false,
        data: null,
        error: 'Answer is required',
      });
    }

    // Get AI feedback
    const feedback = await getInterviewFeedback(question, answer);

    return res.status(200).json({
      success: true,
      data: feedback,
      error: null,
    });
  } catch (error) {
    console.error('Interview route error:', error.message);
    return res.status(500).json({
      success: false,
      data: null,
      error: error.message || 'Failed to process interview feedback',
    });
  }
});

module.exports = router;
