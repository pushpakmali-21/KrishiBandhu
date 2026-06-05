/**
 * seed-historical.js
 * 
 * One-time script to seed MongoDB with historical price data from mock-prices.js.
 * This gives the ML model enough data to generate forecasts immediately.
 * Run ONCE after the first ingest-prices.js run.
 * 
 * Usage:
 *   node scripts/seed-historical.js
 */

const path = require('path');
const connectDB = require('../db');
const DailyPrice = require('../models/DailyPrice');
const Farmer = require('../models/Farmer');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const mockPrices = require('../data/mock-prices');

async function seedHistoricalData() {
  console.log('🌱 Seeding historical data from mock-prices...\n');
  await connectDB();

  console.log('🧑‍🌾 Seeding dummy farmer profile...');
  await Farmer.findOneAndUpdate(
    { farmerId: 'f101' },
    {
      farmerId: 'f101',
      name: 'Ramesh Patel',
      transactionCount: 42,
      avgBuyerRating: 4.8,
      onTimeFulfillmentRate: 98,
      verified: true
    },
    { upsert: true }
  );
  console.log('   ✅ Done\\n');

  let totalInserted = 0;
  let totalSkipped = 0;

  for (const [cropKey, cropData] of Object.entries(mockPrices)) {
    if (!cropData.history || cropData.history.length === 0) continue;

    console.log(`📅 Seeding ${cropKey} (${cropData.history.length} records)...`);

    for (const entry of cropData.history) {
      try {
        const date = new Date(entry.date);
        date.setHours(0, 0, 0, 0);

        await DailyPrice.findOneAndUpdate(
          { crop: cropKey, date, mandi: 'Historical Seed' },
          {
            crop: cropKey,
            date,
            modalPrice: entry.price,
            mandi: 'Historical Seed'
          },
          { upsert: true, returnDocument: 'after' }
        );
        totalInserted++;
      } catch (err) {
        // Skip duplicates silently
        if (err.code === 11000) {
          totalSkipped++;
        } else {
          console.error(`   ❌ Error for ${cropKey} on ${entry.date}:`, err.message);
        }
      }
    }

    console.log(`   ✅ Done\n`);
  }

  console.log(`✨ Seeding complete! Inserted: ${totalInserted}, Skipped (duplicates): ${totalSkipped}`);
  process.exit(0);
}

seedHistoricalData();
