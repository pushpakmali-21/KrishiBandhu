const express = require('express');
const CropForecast = require('../models/CropForecast');
const DailyPrice = require('../models/DailyPrice');
const { normalizeCropId } = require('../utils/crops');
const router = express.Router();

// GET /api/recommendations/:crop
router.get('/:crop', async (req, res) => {
  const { crop } = req.params;
  const internalCropName = normalizeCropId(crop);

  if (!internalCropName) {
    return res.status(400).json({ error: 'Invalid crop specified' });
  }

  try {
    const forecastData = await CropForecast.findOne({ crop: internalCropName });
    const latestPrice = await DailyPrice.findOne({ crop: internalCropName }).sort({ date: -1 });

    if (!forecastData) {
      return res.json({
        crop: internalCropName,
        recommendation: 'HOLD',
        confidence: 0,
        reasoning: 'Forecast not yet available. Please run the ML pipeline.',
        expectedPrice: latestPrice ? latestPrice.modalPrice : 0,
        daysToWait: 0
      });
    }

    res.json({
      crop: internalCropName,
      recommendation: forecastData.recommendation,
      confidence: 0.85, // Add to schema later if needed
      reasoning: `Based on a current price of ₹${latestPrice ? latestPrice.modalPrice : forecastData.currentPrice} and a volatility of ${forecastData.volatility.toFixed(1)}%, it is best to ${forecastData.recommendation}.`,
      expectedPrice: forecastData.forecast[0] || forecastData.currentPrice,
      daysToWait: forecastData.recommendation === 'WAIT' ? 7 : 0
    });
  } catch (err) {
    console.error('Recommendation Error:', err);
    res.status(500).json({ error: 'Failed to fetch recommendation' });
  }
});

module.exports = router;
