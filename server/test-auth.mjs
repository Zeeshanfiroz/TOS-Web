/**
 * ═══════════════════════════════════════════════════════════════════
 *  AUTH REGRESSION SUITE — run this after ANY change to auth code.
 * ═══════════════════════════════════════════════════════════════════
 *  Usage:  cd server && npm run test:auth
 *
 *  Requires: server running on localhost:5000 + seeded DB
 *  (admin@club.com / admin12345, member@club.com / member12345)
 *
 *  CI NOTE: this is a MANUAL smoke test (needs a running server + seeded
 *  DB), not wired into CI. If you add CI later, a minimal pipeline would
 *  be: spin up Mongo (mongo memory server or a service container) →
 *  `npm run seed` → start server → `node test-auth.mjs` → fail the build
 *  on non-zero exit. The suite already exits 1 on any failure, so it is
 *  CI-ready as-is — only the server/DB lifecycle needs wiring.
 */
import 'dotenv/config';

const BASE = process.env.TEST_BASE_URL || 'http://localhost:5000/api';
let passed = 0;
let failed = 0;

const check = (name, ok, detail = '') => {
  console.log(`${ok ? '✅' : '❌'} ${name}${detail ? ` — ${detail}` : ''}`);
  ok ? passed++ : failed++;
};

const post = async (path, body, headers = {}) => {
  const res = await fetch(BASE + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
  return { status: res.status, data: await res.json().catch(() => ({})) };
};

const get = async (path, headers = {}) => {
  const res = await fetch(BASE + path, { headers });
  return { status: res.status, data: await res.json().catch(() => ({})) };
};

// ── 1. Health ──
console.log('\n── 1. Server health ──');
const health = await get('/health');
check('Server is up', health.status === 200);

// ── 2-3. Login + Bearer auth ──
console.log('\n── 2-3. Login + Bearer header auth ──');
const login = await post('/auth/login', {
  email: 'admin@club.com',
  password: 'admin12345',
});
const { accessToken, refreshToken } = login.data?.data || {};
check('Login returns both tokens in body', Boolean(accessToken && refreshToken));

const me = await get('/auth/me', { Authorization: `Bearer ${accessToken}` });
check('Bearer header auth works (/auth/me)', me.data?.data?.email === 'admin@club.com');

// ── 4. Invalid JWT rejected ──
console.log('\n── 4. Invalid token rejected ──');
const badToken = await get('/auth/me', { Authorization: 'Bearer abc.def.ghi' });
check('Garbage JWT rejected (401)', badToken.status === 401, `status ${badToken.status}`);

// ── 5-6. Refresh rotation + replay detection ──
console.log('\n── 5-6. Refresh rotation + replay detection ──');
const r1 = await post('/auth/refresh', { refreshToken });
check(
  'Refresh via BODY token works (no cookie)',
  Boolean(r1.data?.data?.accessToken && r1.data?.data?.refreshToken)
);

const replay = await post('/auth/refresh', { refreshToken });
check(
  'Replayed (rotated) token → session revoked (401)',
  replay.status === 401,
  `status ${replay.status}`
);

const afterRevoke = await post('/auth/refresh', {
  refreshToken: r1.data?.data?.refreshToken,
});
check(
  'Revoked session: new refresh token also rejected',
  afterRevoke.status === 401,
  `status ${afterRevoke.status}`
);

// ── 7-8. Logout invalidation ──
console.log('\n── 7-8. Logout invalidation ──');
const login2 = await post('/auth/login', {
  email: 'member@club.com',
  password: 'member12345',
});
const t2 = login2.data?.data || {};

const logoutRes = await post(
  '/auth/logout',
  { refreshToken: t2.refreshToken },
  { Authorization: `Bearer ${t2.accessToken}` }
);
check('Logout accepts body refresh token', logoutRes.status === 200);

const afterLogout = await post('/auth/refresh', { refreshToken: t2.refreshToken });
check('Refresh after logout rejected (401)', afterLogout.status === 401);

// ── 9. NoSQL injection ──
console.log('\n── 9. NoSQL injection blocked ──');
const inj = await post('/auth/login', { email: { $gt: '' }, password: { $gt: '' } });
check(
  'Operator injection rejected (4xx)',
  inj.status >= 400 && inj.status < 500,
  `status ${inj.status}`
);

// ── 10. Unverified account cannot login ──
console.log('\n── 10. Unverified login blocked ──');
const stamp = Date.now();
const unverifiedEmail = `authtest${stamp}@club.com`;
await post('/auth/signup', {
  name: 'Auth Regression',
  email: unverifiedEmail,
  password: 'test12345',
});
const unverifiedLogin = await post('/auth/login', {
  email: unverifiedEmail,
  password: 'test12345',
});
check(
  'Unverified login → 403 + OTP re-sent',
  unverifiedLogin.status === 403 &&
    unverifiedLogin.data?.data?.needsVerification === true,
  `status ${unverifiedLogin.status}`
);

// ── 11. OTP brute-force lock ──
console.log('\n── 11. OTP brute-force lock ──');
let locked = false;
for (let i = 1; i <= 6; i++) {
  const r = await post('/auth/verify-otp', { email: unverifiedEmail, otp: '000000' });
  if (r.status === 429) {
    locked = true;
    console.log(`  (locked at attempt ${i})`);
    break;
  }
}
check('5 wrong OTP attempts → locked (429)', locked);

// ── 12. Role-based access control ──
console.log('\n── 12. Role-based access control ──');
const adminPanel = await get('/users', { Authorization: `Bearer ${t2.accessToken}` });
check(
  'Revoked member token cannot access admin routes',
  adminPanel.status === 401 || adminPanel.status === 403,
  `status ${adminPanel.status}`
);

// ── 13. Password reset privacy ──
console.log('\n── 13. Password reset privacy ──');
const resetFake = await post('/auth/forgot-password', {
  email: 'nonexistent@nowhere.com',
});
const resetReal = await post('/auth/forgot-password', { email: 'admin@club.com' });
check(
  'Reset response identical for existing & non-existing accounts',
  JSON.stringify(resetFake.data) === JSON.stringify(resetReal.data)
);

// ═══ Summary ═══
console.log('\n════════════════════════════════════');
console.log(`${passed} passed, ${failed} failed`);
console.log('════════════════════════════════════');
if (failed > 0) {
  console.log('\n🚨 AUTH REGRESSION DETECTED — do NOT deploy!');
  process.exit(1);
}
console.log('\n🌱 All auth flows healthy — safe to deploy.');

