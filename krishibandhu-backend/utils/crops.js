const VALID_CROPS = new Set(['wheat', 'jowar', 'rice', 'cotton', 'jute', 'tur', 'redChilli']);

function normalizeCropId(crop) {
  if (typeof crop !== 'string') {
    return null;
  }

  const normalized = crop.trim().toLowerCase();
  if (normalized === 'redchilli') {
    return 'redChilli';
  }

  return VALID_CROPS.has(normalized) ? normalized : null;
}

module.exports = { VALID_CROPS, normalizeCropId };
