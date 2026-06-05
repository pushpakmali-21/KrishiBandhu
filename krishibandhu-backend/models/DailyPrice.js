const mongoose = require('mongoose');

const dailyPriceSchema = new mongoose.Schema({
  crop: {
    type: String,
    required: true,
    index: true,
  },
  date: {
    type: Date,
    required: true,
  },
  minPrice: {
    type: Number,
  },
  maxPrice: {
    type: Number,
  },
  modalPrice: { // Average/modal price
    type: Number,
    required: true,
  },
  mandi: {
    type: String,
    default: 'National Average',
  },
}, { timestamps: true });

// Ensure we don't have duplicate daily prices for the same crop & mandi
dailyPriceSchema.index({ crop: 1, date: 1, mandi: 1 }, { unique: true });

module.exports = mongoose.model('DailyPrice', dailyPriceSchema);
