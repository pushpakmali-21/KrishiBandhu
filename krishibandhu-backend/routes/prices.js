const express = require('express');
const mockPrices = require('../data/mock-prices');
const router = express.Router();

// GET /api/prices/:crop
router.get('/:crop', (req, res) => {
  const { crop } = req.params;
  const cropLower = crop.toLowerCase();

  if (!mockPrices[cropLower]) {
    return res.status(404).json({ error: 'Crop not found' });
  }

  res.json(mockPrices[cropLower]);
});

// GET /api/prices - All crops
router.get('/', (req, res) => {
  res.json(mockPrices);
});

module.exports = router;
