const app = require('../server');
const Otp = require('../models/Otp');

function listen(appInstance) {
  return new Promise((resolve) => {
    const server = appInstance.listen(0, '127.0.0.1', () => {
      resolve(server);
    });
  });
}

async function readJson(response) {
  if (!response.ok) {
    throw new Error(`${response.url} failed with ${response.status}`);
  }

  return response.json();
}

function cookieHeaderFrom(response) {
  const setCookie = response.headers.get('set-cookie');
  if (!setCookie) {
    throw new Error('Login did not return an auth cookie');
  }

  return setCookie.split(';')[0];
}

async function main() {
  const server = await listen(app);
  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}`;

  try {
    const health = await readJson(await fetch(`${baseUrl}/api/health`));
    if (health.status !== 'Server running') {
      throw new Error('Health endpoint returned an unexpected status');
    }

    const price = await readJson(await fetch(`${baseUrl}/api/prices/wheat`));
    if (!price.current || !Array.isArray(price.history)) {
      throw new Error('Price endpoint returned malformed data');
    }

    const recommendation = await readJson(await fetch(`${baseUrl}/api/recommendations/wheat`));
    if (!recommendation.recommendation || recommendation.recommendation.includes('Fallback')) {
      throw new Error('ML recommendation fell back instead of using the Python model');
    }

    const trust = await readJson(await fetch(`${baseUrl}/api/trust/f101`));
    if (!trust.trustScore || typeof trust.trustScore.score !== 'number') {
      throw new Error('Trust endpoint returned malformed data');
    }

    const phoneNumber = '9999999999';
    await readJson(await fetch(`${baseUrl}/api/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber }),
    }));

    const otpRecord = await Otp.findOne({ phoneNumber }).sort({ createdAt: -1 });
    if (!otpRecord) {
      throw new Error('OTP was not created during smoke test');
    }

    const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber, otp: otpRecord.otp }),
    });
    const login = await readJson(loginResponse);
    if (!login.success) {
      throw new Error('Login endpoint did not authenticate the smoke-test user');
    }
    const authCookie = cookieHeaderFrom(loginResponse);

    const connect = await readJson(await fetch(`${baseUrl}/api/marketplace/connect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: authCookie },
      body: JSON.stringify({ buyerName: 'Kisan Tradelink', crop: 'wheat', quantity: '10' }),
    }));
    if (!connect.success) {
      throw new Error('Marketplace connect endpoint failed');
    }

    console.log('Backend smoke test passed');
  } finally {
    server.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
