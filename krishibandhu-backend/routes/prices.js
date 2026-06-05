const express = require('express');
const DailyPrice = require('../models/DailyPrice');
const CropForecast = require('../models/CropForecast');
const { normalizeCropId } = require('../utils/crops');
const router = express.Router();

// GET /api/prices/:crop
router.get('/:crop', async (req, res) => {
  const { crop } = req.params;
  
  try {
    const internalCropName = normalizeCropId(crop);
    if (!internalCropName) {
      return res.status(400).json({ error: 'Invalid crop specified' });
    }
    
    // Fetch last 10 days of history
    const historyData = await DailyPrice.find({ crop: internalCropName })
      .sort({ date: -1 })
      .limit(10);
      
    // Needs ascending order for charts
    const history = historyData.reverse().map(d => ({
      date: d.date.toISOString().split('T')[0],
      price: d.modalPrice
    }));
    
    const current = history.length > 0 ? history[history.length - 1].price : 0;
    
    // Fetch forecast
    const forecastData = await CropForecast.findOne({ crop: internalCropName });
    
    res.json({
      current: current,
      lastUpdate: new Date(),
      history: history,
      forecast: forecastData ? forecastData.forecast : [],
      demand: forecastData ? forecastData.demand : [],
      volatility: forecastData ? forecastData.volatility : 0
    });
  } catch (error) {
    console.error('Error fetching prices:', error);
    res.status(500).json({ error: 'Failed to fetch prices' });
  }
});

// GET /api/prices - All crops
router.get('/', async (req, res) => {
  try {
    const crops = await DailyPrice.distinct('crop');
    const result = {};
    
    for (const crop of crops) {
      const latest = await DailyPrice.findOne({ crop }).sort({ date: -1 });
      const forecast = await CropForecast.findOne({ crop });
      
      result[crop] = {
        current: latest ? latest.modalPrice : 0,
        lastUpdate: latest ? latest.date : new Date(),
        forecast: forecast ? forecast.forecast : [],
        demand: forecast ? forecast.demand : [],
        volatility: forecast ? forecast.volatility : 0
      };
    }
    
    res.json(result);
  } catch (error) {
    console.error('Error fetching all prices:', error);
    res.status(500).json({ error: 'Failed to fetch all prices' });
  }
});

module.exports = router;
