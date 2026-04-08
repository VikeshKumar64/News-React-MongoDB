// Simple test script to validate /signup and /login endpoints
const fetch = require('node-fetch');

async function run() {
  const BASE = 'http://localhost:4000';
  const testEmail = `testuser+${Date.now()}@example.com`;
  try {
    console.log('Signing up', testEmail);
    const signupRes = await fetch(`${BASE}/signup`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test User', email: testEmail, password: 'secret123' })
    });
    const signupData = await signupRes.json();
    console.log('Signup status', signupRes.status, signupData);

    console.log('Logging in');
    const loginRes = await fetch(`${BASE}/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: 'secret123' })
    });
    const loginData = await loginRes.json();
    console.log('Login status', loginRes.status, loginData);
  } catch (err) {
    console.error('Test failed', err);
  }
}

run();
