const express = require('express');
const { calculateTrustScore } = require('../trust-score');
const Farmer = require('../models/Farmer');
const router = express.Router();

// GET /api/trust/:farmerId
router.get('/:farmerId', async (req, res) => {
  try {
    const farmer = await Farmer.findOne({ farmerId: req.params.farmerId });
    
    if (!farmer) {
      return res.status(404).json({ error: 'Farmer profile not found in database' });
    }

    // Calculate the live trust score
    const trustData = calculateTrustScore(farmer);

    res.json({
      farmerId: farmer.farmerId,
      name: farmer.name,
      profileData: {
        transactions: farmer.transactionCount,
        rating: farmer.avgBuyerRating,
        fulfillment: farmer.onTimeFulfillmentRate
      },
      trustScore: trustData
    });
  } catch (err) {
    console.error('Error fetching farmer trust data:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
