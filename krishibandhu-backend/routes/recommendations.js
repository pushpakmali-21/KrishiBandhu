const express = require('express');
const mockPrices = require('../data/mock-prices');
const { callPythonModel } = require('../ml-integration');
const router = express.Router();

// GET /api/recommendations/:crop
router.get('/:crop', async (req, res) => {
  const { crop } = req.params;
  const cropLower = crop.toLowerCase();

  if (!mockPrices[cropLower]) {
    return res.status(404).json({ error: 'Crop not found' });
  }

  const data = mockPrices[cropLower];

  try {
    const mlResult = await callPythonModel({
      history: data.history,
      current: data.current
    });

    res.json({
      crop: cropLower,
      recommendation: mlResult.recommendation.action,
      confidence: mlResult.recommendation.confidence,
      reasoning: mlResult.recommendation.reasoning || mlResult.recommendation.action,
      expectedPrice: mlResult.recommendation.expected_price || data.current,
      daysToWait: mlResult.recommendation.days_to_wait || 0
    });
  } catch (err) {
    console.error('ML Recommendation Error:', err);
    res.status(500).json({ error: 'Failed to generate ML recommendation' });
  }
});

module.exports = router;
