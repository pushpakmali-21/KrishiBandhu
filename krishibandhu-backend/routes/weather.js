const express = require('express');
const router = express.Router();

// Mock weather data (Nashik coordinates)
const getMockWeather = () => {
  return {
    location: 'Nashik, Maharashtra',
    forecast: [
      { day: 1, temp: 32, humidity: 55, rainfall: 0, condition: 'Sunny' },
      { day: 2, temp: 33, humidity: 52, rainfall: 0, condition: 'Sunny' },
      { day: 3, temp: 31, humidity: 58, rainfall: 2, condition: 'Partly Cloudy' },
      { day: 4, temp: 29, humidity: 62, rainfall: 10, condition: 'Rainy' },
      { day: 5, temp: 28, humidity: 68, rainfall: 15, condition: 'Rainy' },
      { day: 6, temp: 30, humidity: 60, rainfall: 5, condition: 'Cloudy' },
      { day: 7, temp: 32, humidity: 54, rainfall: 0, condition: 'Sunny' },
    ],
    lastUpdate: new Date()
  };
};

router.get('/forecast', (req, res) => {
  const weather = getMockWeather();
  res.json(weather);
});

module.exports = router;
