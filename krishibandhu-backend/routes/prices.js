const express = require('express');
const mockPrices = require('../data/mock-prices');
const router = express.Router();

// GET /api/prices/:crop
router.get('/:crop', (req, res) => {
  const { crop } = req.params;
  const targetCrop = Object.keys(mockPrices).find(k => k.toLowerCase() === crop.toLowerCase());

  if (!targetCrop || !mockPrices[targetCrop]) {
    return res.status(404).json({ error: 'Crop not found' });
  }

  res.json(mockPrices[targetCrop]);
});

// GET /api/prices - All crops
router.get('/', (req, res) => {
  res.json(mockPrices);
});

module.exports = router;
