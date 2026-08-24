/**
 * Security fix verification script
 * Run: cd server && node test-security.mjs
 */
import 'dotenv/config';

const BASE = 'http://localhost:5000/api';

const post = async (path, body) => {
  const res = await fetch(BASE + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return { status: res.status, data: await res.json().catch(() => ({})) };
};

// ── Test 1: NoSQL injection on login ──
console.log('── Test 1: NoSQL Injection (#82) ──');
const inj = await post('/auth/login', { email: { $gt: '' }, password: { $gt: '' } });
console.log(`  Status: ${inj.status} → ${inj.data.message}`);
console.log(inj.status >= 400 ? '  ✅ BLOCKED' : '  ❌ VULNERABLE!');

// ── Test 2: OTP brute force (6 wrong attempts → 429 on 6th) ──
console.log('\n── Test 2: OTP Brute Force (#9/#51) ──');
const email = `sectest${Date.now()}@club.com`;
await post('/auth/signup', { name: 'Sec Test', email, password: 'test12345' });
let blocked = false;
for (let i = 1; i <= 6; i++) {
  const r = await post('/auth/verify-otp', { email, otp: '000000' });
  console.log(`  Attempt ${i}: ${r.status} → ${r.data.message}`);
  if (r.status === 429) blocked = true;
}
console.log(blocked ? '  ✅ OTP invalidated after 5 wrong attempts' : '  ❌ NO attempt limit!');

console.log('\nDone.');
