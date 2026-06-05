const connectDB = require('../db');
const DailyPrice = require('../models/DailyPrice');
require('dotenv').config();

const TARGET_CROPS = ['Wheat', 'Jowar(Sorghum)', 'Rice', 'Cotton', 'Jute', 'Arhar (Tur/Red Gram)', 'Red Chilli'];
const API_KEY = process.env.DATA_GOV_IN_API_KEY;
// Note: This resource ID might need to be updated to the latest Daily Mandi Prices resource on data.gov.in
const RESOURCE_ID = '9ef84268-d588-465a-a308-a864a43d0070'; 

async function fetchFromDataGovIn(crop) {
  if (!API_KEY) {
    throw new Error(`[CRITICAL] No DATA_GOV_IN_API_KEY found. Halting ingest to prevent writing mock data to the database.`);
  }

  try {
    const url = `https://api.data.gov.in/resource/${RESOURCE_ID}?format=json&filters[commodity]=${encodeURIComponent(crop)}&limit=10`;
    const response = await fetch(url, {
      headers: { 'api-key': API_KEY }
    });
    const data = await response.json();

    if (data.records && data.records.length > 0) {
      // Average out the modal prices across mandis for the daily national average
      let totalModal = 0;
      let validRecords = 0;
      data.records.forEach(record => {
        if (record.modal_price) {
          totalModal += parseFloat(record.modal_price);
          validRecords++;
        }
      });
      
      if (validRecords > 0) {
        return {
          crop: crop,
          modalPrice: totalModal / validRecords,
          date: new Date(),
          mandi: 'National Average'
        };
      }
    }
  } catch (error) {
    console.error(`Error fetching data for ${crop}:`, error.message);
  }
  return null;
}

async function runIngestion() {
  console.log('Starting daily price ingestion...');
  await connectDB();

  for (const crop of TARGET_CROPS) {
    console.log(`Fetching data for ${crop}...`);
    const priceData = await fetchFromDataGovIn(crop);

    if (priceData) {
      try {
        // Internal crop name mapping for consistency with old data
        const internalCropName = mapCropName(crop);
        
        // Use beginning of the day for date matching to avoid duplicate entries for the same day
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        await DailyPrice.findOneAndUpdate(
          { crop: internalCropName, date: today, mandi: priceData.mandi },
          { 
            crop: internalCropName,
            date: today,
            modalPrice: priceData.modalPrice,
            mandi: priceData.mandi
          },
          { upsert: true, returnDocument: 'after' }
        );
        console.log(`✅ Successfully updated ${internalCropName} price: ₹${priceData.modalPrice}`);
      } catch (err) {
        console.error(`❌ DB Error for ${crop}:`, err.message);
      }
    } else {
      console.log(`⚠️ No data found for ${crop} today.`);
    }
  }

  console.log('Ingestion complete. Exiting...');
  process.exit(0);
}

function mapCropName(apiName) {
  const map = {
    'Wheat': 'wheat',
    'Jowar(Sorghum)': 'jowar',
    'Rice': 'rice',
    'Cotton': 'cotton',
    'Jute': 'jute',
    'Arhar (Tur/Red Gram)': 'tur',
    'Red Chilli': 'redChilli'
  };
  return map[apiName] || apiName.toLowerCase();
}

runIngestion();
