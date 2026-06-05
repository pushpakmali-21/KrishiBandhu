/**
 * run-ml-pipeline.js
 * 
 * KrishiBandhu ML Pipeline Runner
 * --------------------------------
 * Run this file manually or schedule it to execute daily AFTER ingest-prices.js.
 * 
 * What it does:
 *   1. Connects to MongoDB Atlas.
 *   2. Fetches historical prices for each crop.
 *   3. Calls the Python ML model (ml-service.py) to generate a 7-day forecast.
 *   4. Saves the forecast + recommendation back to MongoDB (CropForecast collection).
 * 
 * Usage:
 *   node scripts/run-ml-pipeline.js
 * 
 * To automate daily (Windows Task Scheduler or Unix cron):
 *   node /path/to/scripts/ingest-prices.js && node /path/to/scripts/run-ml-pipeline.js
 */

const { spawnSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const connectDB = require('../db');
const DailyPrice = require('../models/DailyPrice');
const CropForecast = require('../models/CropForecast');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const TARGET_CROPS = ['wheat', 'jowar', 'rice', 'cotton', 'jute', 'tur', 'redChilli'];

// ─── Python Binary Resolution ────────────────────────────────────────────────

function getPythonCandidates() {
  return [
    process.env.PYTHON_BIN,
    path.join(__dirname, '..', '.venv', 'Scripts', 'python.exe'),
    path.join(__dirname, '..', '.venv', 'bin', 'python'),
    path.join(__dirname, '..', '..', '.venv', 'Scripts', 'python.exe'),
    path.join(__dirname, '..', '..', '.venv', 'bin', 'python'),
    'python3',
    'python',
  ].filter(Boolean);
}

function findPythonBinary() {
  for (const candidate of getPythonCandidates()) {
    if (candidate.includes(path.sep) && !fs.existsSync(candidate)) continue;
    const result = spawnSync(candidate, ['-c', 'import json, numpy; print("ok")'], {
      encoding: 'utf8',
      timeout: 5000,
      windowsHide: true,
    });
    if (result.status === 0) return candidate;
  }
  throw new Error('No Python binary with numpy found.');
}

// ─── ML Inference ────────────────────────────────────────────────────────────

function runMLModel(inputData) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, '..', 'ml-service.py');
    const pythonBin = findPythonBinary();
    const python = spawn(pythonBin, [scriptPath], { windowsHide: true });

    let output = '';
    let errorOutput = '';

    python.stdin.write(JSON.stringify(inputData));
    python.stdin.end();

    python.stdout.on('data', (data) => { output += data.toString(); });
    python.stderr.on('data', (data) => { errorOutput += data.toString(); });

    python.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(`Python exited with code ${code}: ${errorOutput}`));
      }
      try {
        resolve(JSON.parse(output.trim()));
      } catch (e) {
        reject(new Error(`Failed to parse ML output: ${output}`));
      }
    });

    python.on('error', (err) => reject(err));
  });
}

// ─── Main Pipeline ────────────────────────────────────────────────────────────

async function runPipeline() {
  console.log('🚀 Starting ML Pipeline...\n');
  await connectDB();

  for (const crop of TARGET_CROPS) {
    console.log(`📊 Processing: ${crop}`);

    // Fetch last 30 days of price history from MongoDB
    const historyData = await DailyPrice.find({ crop })
      .sort({ date: -1 })
      .limit(30);

    if (historyData.length < 2) {
      console.log(`   ⚠️  Not enough data for ${crop} (need at least 2 days). Skipping.\n`);
      continue;
    }

    // Reverse to ascending order for the ML model
    const history = historyData
      .reverse()
      .map(d => ({
        date: d.date.toISOString().split('T')[0],
        price: d.modalPrice
      }));

    const current = history[history.length - 1].price;

    try {
      const mlResult = await runMLModel({ crop, history, current });

      if (mlResult.error) {
        console.log(`   ❌ ML Error for ${crop}: ${mlResult.error}\n`);
        continue;
      }

      // Map action strings to our schema enum
      const actionMap = {
        'WAIT': 'WAIT',
        'SELL NOW': 'SELL NOW',
        'HOLD': 'HOLD',
      };
      const recommendation = actionMap[mlResult.recommendation?.action] || 'HOLD';

      // Upsert forecast into MongoDB
      await CropForecast.findOneAndUpdate(
        { crop },
        {
          crop,
          currentPrice: current,
          forecast: mlResult.forecast || [],
          demand: mlResult.demand || [],
          volatility: mlResult.volatility || 0,
          recommendation,
          lastUpdated: new Date(),
        },
        { upsert: true }
      );

      console.log(`   ✅ Saved forecast for ${crop}: ${recommendation} @ ₹${current}`);
      console.log(`      Forecast (next 7 days): ${(mlResult.forecast || []).map(p => `₹${p}`).join(', ')}\n`);

    } catch (err) {
      console.error(`   ❌ Failed for ${crop}:`, err.message, '\n');
    }
  }

  console.log('✨ ML Pipeline complete. Exiting...');
  process.exit(0);
}

runPipeline();
