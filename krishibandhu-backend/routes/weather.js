const express = require('express');
const router = express.Router();

router.get('/forecast', async (req, res) => {
  try {
    // Coordinates for Nashik, Maharashtra
    const lat = 20.0110;
    const lon = 73.7903;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,precipitation_sum&timezone=auto`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Open-Meteo API returned status ${response.status}`);
    }
    const data = await response.json();

    const forecast = data.daily.time.map((dateStr, index) => {
      const rain = data.daily.precipitation_sum[index] || 0;
      let condition = 'Sunny';
      if (rain > 10) condition = 'Rainy';
      else if (rain > 0) condition = 'Cloudy';

      return {
        day: index + 1,
        temp: Math.round(data.daily.temperature_2m_max[index]),
        humidity: Math.round(50 + Math.random() * 20), // Mocked humidity as OpenMeteo daily doesn't provide it by default
        rainfall: rain,
        condition: condition
      };
    });

    res.json({
      location: 'Nashik, Maharashtra',
      forecast: forecast,
      lastUpdate: new Date()
    });

  } catch (error) {
    console.error('Weather API Error:', error);
    // Fallback to static mock if API fails
    res.json({
      location: 'Nashik, Maharashtra (Offline Mode)',
      forecast: [
        { day: 1, temp: 32, humidity: 55, rainfall: 0, condition: 'Sunny' },
        { day: 2, temp: 33, humidity: 52, rainfall: 0, condition: 'Sunny' },
        { day: 3, temp: 31, humidity: 58, rainfall: 2, condition: 'Cloudy' },
        { day: 4, temp: 29, humidity: 62, rainfall: 10, condition: 'Rainy' },
        { day: 5, temp: 28, humidity: 68, rainfall: 15, condition: 'Rainy' },
        { day: 6, temp: 30, humidity: 60, rainfall: 5, condition: 'Cloudy' },
        { day: 7, temp: 32, humidity: 54, rainfall: 0, condition: 'Sunny' },
      ],
      lastUpdate: new Date()
    });
  }
});

module.exports = router;
