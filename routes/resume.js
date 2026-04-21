const express = require('express');
const router = express.Router();
const { getResumeFeedback } = require('../services/aiService');

// POST /resume - Get resume feedback
router.post('/', async (req, res) => {
  try {
    const { text } = req.body;

    // Validate input
    if (!text || text.trim() === '') {
      return res.status(400).json({
        success: false,
        data: null,
        error: 'Resume text is required',
      });
    }

    // Get AI feedback
    const feedback = await getResumeFeedback(text);

    return res.status(200).json({
      success: true,
      data: feedback,
      error: null,
    });
  } catch (error) {
    console.error('Resume route error:', error.message);
    return res.status(500).json({
      success: false,
      data: null,
      error: error.message || 'Failed to process resume',
    });
  }
});

module.exports = router;
