function calculateTrustScore(farmerData) {
  /**
   * Trust score calculation (0-100)
   * Factors:
   * - Transaction count (max 20 points)
   * - On-time fulfillment rate (max 30 points)
   * - Average buyer rating (max 25 points)
   * - Profile completeness (max 15 points)
   * - Account age (max 10 points)
   */
  
  let score = 0;
  
  // Transaction count
  const transCount = Math.min(farmerData.transactionCount || 0, 100);
  score += (transCount / 100) * 20;
  
  // On-time fulfillment
  const fulfillmentRate = farmerData.onTimeFulfillmentRate || 0;
  score += (fulfillmentRate / 100) * 30;
  
  // Average rating
  const avgRating = farmerData.avgBuyerRating || 0;
  score += (avgRating / 5) * 25;
  
  // Profile completeness
  let profileComplete = 0;
  if (farmerData.name) profileComplete++;
  if (farmerData.phone) profileComplete++;
  if (farmerData.crops && farmerData.crops.length > 0) profileComplete++;
  if (farmerData.location) profileComplete++;
  score += (profileComplete / 4) * 15;
  
  // Account age in days
  const accountAge = farmerData.accountAgeDays || 0;
  const ageScore = Math.min(accountAge / 365, 1); // Max at 1 year
  score += ageScore * 10;
  
  return {
    score: Math.round(score),
    level: getScoreLevel(score),
    breakdown: {
      transactions: Math.round((transCount / 100) * 20),
      fulfillment: Math.round((fulfillmentRate / 100) * 30),
      rating: Math.round((avgRating / 5) * 25),
      profile: Math.round((profileComplete / 4) * 15),
      age: Math.round(ageScore * 10)
    }
  };
}

function getScoreLevel(score) {
  if (score >= 90) return 'Excellent';
  if (score >= 75) return 'Very Good';
  if (score >= 60) return 'Good';
  if (score >= 45) return 'Fair';
  return 'New Seller';
}

module.exports = { calculateTrustScore };
