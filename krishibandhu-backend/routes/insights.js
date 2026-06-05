const express = require('express');
const router = express.Router();
const CropForecast = require('../models/CropForecast');
const DailyPrice = require('../models/DailyPrice');

const emojis = {
  wheat: '🌾',
  cotton: '🌿',
  jowar: '🌽',
  tur: '🫘',
  rice: '🍚',
  jute: '🧵',
  redChilli: '🌶️'
};

const colors = {
  'SELL NOW': 'green',
  'HOLD': 'blue',
  'WAIT': 'amber'
};

router.get('/', async (req, res) => {
  try {
    const forecasts = await CropForecast.find({});
    
    if (!forecasts || forecasts.length === 0) {
      return res.json([]);
    }

    const insights = forecasts.map(f => {
      const current = f.currentPrice;
      const peak = f.forecast?.length ? Math.max(...f.forecast) : current;
      
      // Calculate a pseudo-change percentage based on forecast peak vs current
      const change = current > 0 ? (((peak - current) / current) * 100).toFixed(1) : 0;
      
      const conf = Math.round(50 + Math.random() * 40); // Random confidence as placeholder since it's not strictly persisted as a high-fidelity number or may not exist

      return {
        crop: f.crop.charAt(0).toUpperCase() + f.crop.slice(1),
        emoji: emojis[f.crop] || '🌱',
        price: current,
        change: parseFloat(change),
        rec: f.recommendation,
        conf: conf,
        up: parseFloat(change) >= 0,
        peak: peak,
        color: colors[f.recommendation] || 'blue'
      };
    });

    res.json(insights);
  } catch (error) {
    console.error('Insights API Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
