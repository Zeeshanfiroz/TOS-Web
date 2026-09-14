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

// ── Test 3: Refresh token rotation + replay detection (BODY path) ──
// The client falls back to sending the refresh token in the request body
// (cookies get dropped on cross-site deploys). Verify the body path too:
// rotate once, then replay the OLD token → must be rejected + session revoked.
console.log('\n── Test 3: Refresh Rotation + Replay via BODY (#spec C5) ──');
const login3 = await post('/auth/login', { email: 'member@club.com', password: 'member12345' });
if (!login3.data?.data?.refreshToken) {
  console.log('  ⚠️ Skipped — could not login (is the DB seeded? npm run seed)');
} else {
  const oldToken = login3.data.data.refreshToken;

  const r1 = await post('/auth/refresh', { refreshToken: oldToken });
  console.log(`  Refresh #1 (rotation): ${r1.status} → ${r1.data?.success ? 'new token issued ✅' : r1.data.message}`);
  const newToken = r1.data?.data?.refreshToken;

  const r2 = await post('/auth/refresh', { refreshToken: oldToken }); // replay OLD
  console.log(`  Replay old token:      ${r2.status} → ${r2.data?.message || ''}`);
  console.log(r2.status === 401 && /revoked/i.test(r2.data?.message || '')
    ? '  ✅ Replay BLOCKED + session revoked'
    : '  ❌ Replay was NOT blocked!');

  // The freshly rotated token may ALSO be dead now (the replay above revoked
  // the session by clearing refreshTokenHash) — either result is acceptable,
  // but a working NEW token before the replay proves rotation happened.
  const r3 = await post('/auth/refresh', { refreshToken: newToken });
  console.log(`  New token after revoke: ${r3.status} → ${r3.data?.message || 'ok (rotation was live)'}`);
}

console.log('\nDone.');
