const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pricesRoute = require('./routes/prices');
const weatherRoute = require('./routes/weather');
const recommendationsRoute = require('./routes/recommendations');
const trustRoute = require('./routes/trust');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5001;

// Routes
app.use('/api/prices', pricesRoute);
app.use('/api/weather', weatherRoute);
app.use('/api/recommendations', recommendationsRoute);
app.use('/api/trust', trustRoute);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'Server running',
    timestamp: new Date(),
    endpoints: [
      'GET /api/prices/:crop',
      'GET /api/prices',
      'GET /api/weather/forecast',
      'GET /api/recommendations/:crop',
      'GET /api/trust/:farmerId'
    ]
  });
});

// Global error handler (Express 5 — async errors are forwarded here)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message || err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
  console.log(`🔗 Test: http://localhost:${PORT}/api/health`);
});

