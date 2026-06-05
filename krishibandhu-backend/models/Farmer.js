const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema({
  farmerId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phone: { type: String },
  location: { type: String },
  crops: [{ type: String }],
  transactionCount: { type: Number, default: 0 },
  onTimeFulfillmentRate: { type: Number, default: 0 },
  avgBuyerRating: { type: Number, default: 0 },
  accountAgeDays: { type: Number, default: 0 }
}, {
  timestamps: true
});

module.exports = mongoose.model('Farmer', farmerSchema);
