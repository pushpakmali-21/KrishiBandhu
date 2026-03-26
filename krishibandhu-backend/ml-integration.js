const { spawn } = require('child_process');
const path = require('path');

const fs = require('fs');

function spawnPython(scriptPath) {
  // Check virtual environment first (Windows and Unix paths)
  const venvPythonWin = path.join(__dirname, '.venv', 'Scripts', 'python.exe');
  const venvPythonUnix = path.join(__dirname, '.venv', 'bin', 'python');

  if (fs.existsSync(venvPythonWin)) {
    return spawn(venvPythonWin, [scriptPath]);
  } else if (fs.existsSync(venvPythonUnix)) {
    return spawn(venvPythonUnix, [scriptPath]);
  }

  // Try python3 first (Linux/Mac), fall back to python (Windows)
  for (const bin of ['python3', 'python']) {
    try {
      const proc = spawn(bin, [scriptPath]);
      return proc;
    } catch {
      // Continue to next binary
    }
  }
  throw new Error('No Python binary found (tried .venv, python3 and python)');
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
