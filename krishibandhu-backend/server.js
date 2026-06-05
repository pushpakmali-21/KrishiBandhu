const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./db');
const { getJwtSecret } = require('./utils/auth');

getJwtSecret();

// Connect to MongoDB
connectDB();
const pricesRoute = require('./routes/prices');
const weatherRoute = require('./routes/weather');
const recommendationsRoute = require('./routes/recommendations');
const trustRoute = require('./routes/trust');
const insightsRoute = require('./routes/insights');

const cookieParser = require('cookie-parser');

const app = express();
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

// Rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply the rate limiting middleware to all requests starting with /api/
app.use('/api/', limiter);

// Routes
app.use('/api/prices', pricesRoute);
app.use('/api/weather', weatherRoute);
app.use('/api/recommendations', recommendationsRoute);
app.use('/api/trust', trustRoute);
app.use('/api/insights', insightsRoute);
app.use('/api/auth', require('./routes/auth'));

const authenticate = require('./middleware/auth');

// Mock Marketplace Connect Route
app.post('/api/marketplace/connect', authenticate, (req, res) => {
  const { buyerName, crop, quantity, message } = req.body;
  if (!buyerName || !crop || !quantity) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  // Simulate processing time
  setTimeout(() => {
    res.json({
      success: true,
      requestId: `REQ-${Math.floor(Math.random() * 10000)}`,
      message: `Request received. ${buyerName} will contact you.`
    });
  }, 1000);
});

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
      'GET /api/trust/:farmerId',
      'POST /api/marketplace/connect'
    ]
  });
});

// Global error handler (Express 5 — async errors are forwarded here)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message || err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
}

module.exports = app;

