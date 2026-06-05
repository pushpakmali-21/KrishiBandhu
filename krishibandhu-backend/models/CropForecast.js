const mongoose = require('mongoose');

const cropForecastSchema = new mongoose.Schema({
  crop: {
    type: String,
    required: true,
    unique: true,
  },
  currentPrice: {
    type: Number,
    required: true,
  },
  forecast: {
    type: [Number], // Array of predicted prices for the next 7 days
    required: true,
  },
  demand: {
    type: [String], // Array of demand indicators e.g. ['HIGH', 'MEDIUM']
    required: true,
  },
  volatility: {
    type: Number,
    required: true,
  },
  recommendation: {
    type: String,
    enum: ['SELL NOW', 'WAIT', 'HOLD'],
    default: 'WAIT',
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

module.exports = mongoose.model('CropForecast', cropForecastSchema);
