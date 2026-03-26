const express = require('express');
const { calculateTrustScore } = require('../trust-score');
const router = express.Router();

// Mock database of farmers
const mockFarmers = {
  'f101': {
    id: 'f101',
    name: 'Ramesh Singh',
    phone: '+91-9876543210',
    location: 'Nashik, Maharashtra',
    crops: ['wheat', 'onion'],
    transactionCount: 45,
    onTimeFulfillmentRate: 92,
    avgBuyerRating: 4.5,
    accountAgeDays: 400
  },
  'f102': {
    id: 'f102',
    name: 'Suresh Patil',
    phone: '+91-8765432109',
    location: 'Pune, Maharashtra',
    crops: ['cotton'],
    transactionCount: 5,
    onTimeFulfillmentRate: 60,
    avgBuyerRating: 3.2,
    accountAgeDays: 30
  }
};

// GET /api/trust/:farmerId
router.get('/:farmerId', (req, res) => {
  const farmer = mockFarmers[req.params.farmerId];
  
  if (!farmer) {
    return res.status(404).json({ error: 'Farmer profile not found in mock database' });
  }

  // Calculate the live trust score
  const trustData = calculateTrustScore(farmer);

  res.json({
    farmerId: farmer.id,
    name: farmer.name,
    profileData: {
      transactions: farmer.transactionCount,
      rating: farmer.avgBuyerRating,
      fulfillment: farmer.onTimeFulfillmentRate
    },
    trustScore: trustData
  });
});

module.exports = router;
