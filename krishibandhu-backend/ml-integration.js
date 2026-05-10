const { spawn } = require('child_process');
const { spawnSync } = require('child_process');
const path = require('path');

const fs = require('fs');

function getPythonCandidates() {
  return [
    process.env.PYTHON_BIN,
    path.join(__dirname, '.venv', 'Scripts', 'python.exe'),
    path.join(__dirname, '.venv', 'bin', 'python'),
    path.join(__dirname, '..', '.venv', 'Scripts', 'python.exe'),
    path.join(__dirname, '..', '.venv', 'bin', 'python'),
    'python3',
    'python',
  ].filter(Boolean);
}

function canRunModel(pythonBin) {
  if (pythonBin.includes(path.sep) && !fs.existsSync(pythonBin)) {
    return false;
  }

  const result = spawnSync(pythonBin, ['-c', 'import json, numpy; print(json.dumps({"ok": True}))'], {
    encoding: 'utf8',
    timeout: 5000,
    windowsHide: true,
  });

  return result.status === 0;
}

function findPythonBinary() {
  const candidates = getPythonCandidates();
  const selected = candidates.find(canRunModel);

  if (!selected) {
    throw new Error(`No Python binary with numpy found (tried ${candidates.join(', ')})`);
  }

  return selected;
}

function spawnPython(scriptPath) {
  return spawn(findPythonBinary(), [scriptPath], { windowsHide: true });
}

function callPythonModel(historicalData) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, 'ml-service.py');

    let python;
    try {
      python = spawnPython(scriptPath);
    } catch (e) {
      console.error(e.message);
      return resolve({
        forecast: [2180, 2200, 2220, 2250, 2280, 2310, 2340],
        recommendation: { action: 'SELL NOW (Fallback)', confidence: 50 }
      });
    }

    let output = '';
    let error = '';

    // Send historical data via stdin
    python.stdin.write(JSON.stringify(historicalData));
    python.stdin.end();

    // Collect stdout
    python.stdout.on('data', (data) => {
      output += data.toString();
    });

    // Collect stderr
    python.stderr.on('data', (data) => {
      error += data.toString();
    });

    // Handle ENOENT — binary not found at spawn time
    python.on('error', (err) => {
      console.error(`Failed to start Python: ${err.message}`);
      resolve({
        forecast: [2180, 2200, 2220, 2250, 2280, 2310, 2340],
        recommendation: { action: 'SELL NOW (Fallback)', confidence: 50 }
      });
    });

    // Handle completion
    python.on('close', (code) => {
      if (code !== 0) {
        console.error(`Python script exited with code ${code}. Error: ${error}`);
        // Fallback to dummy forecast if ML fails
        return resolve({
           forecast: [2180, 2200, 2220, 2250, 2280, 2310, 2340],
           recommendation: { action: 'SELL NOW (Fallback)', confidence: 50 }
        });
      }
      
      try {
        const result = JSON.parse(output.trim());
        resolve(result);
      } catch (e) {
        console.error('Failed to parse Python output:', output);
        reject(e);
      }
    });
  });
}

module.exports = { callPythonModel };
