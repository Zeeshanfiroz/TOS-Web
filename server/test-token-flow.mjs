/**
 * Debug: refresh rotation + replay detection step by step
 */
import 'dotenv/config';
import crypto from 'crypto';

const BASE = 'http://localhost:5000/api';
const sha256 = (v) => crypto.createHash('sha256').update(v).digest('hex');

// 1. Login
const loginRes = await fetch(`${BASE}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'member@club.com', password: 'member12345' }),
});
const login = await loginRes.json();
console.log('1. login ok, refreshToken:', login.data.refreshToken.slice(0, 25) + '...');

// 2. First refresh (rotation)
const r1 = await fetch(`${BASE}/auth/refresh`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ refreshToken: login.data.refreshToken }),
});
const d1 = await r1.json();
console.log('2. refresh #1 status:', r1.status, '| new token:', d1?.data?.refreshToken?.slice(0, 25) + '...');
console.log('   same as old?', d1?.data?.refreshToken === login.data.refreshToken);

// 3. Replay OLD token
const r2 = await fetch(`${BASE}/auth/refresh`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ refreshToken: login.data.refreshToken }),
});
const d2 = await r2.json();
console.log('3. replay old token status:', r2.status, '|', JSON.stringify(d2).slice(0, 120));

// 4. Use the NEW (rotated) token — should still work
const r3 = await fetch(`${BASE}/auth/refresh`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ refreshToken: d1?.data?.refreshToken }),
});
console.log('4. new token refresh status:', r3.status);

