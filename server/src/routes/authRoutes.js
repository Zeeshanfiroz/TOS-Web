import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import passport from 'passport';
import {
  signup,
  login,
  logout,
  getMe,
  verifyOtp,
  resendOtp,
  refresh,
  forgotPassword,
  resetPassword,
  oauthSuccess,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  signupValidator,
  loginValidator,
  verifyOtpValidator,
  resendOtpValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} from '../validators/authValidators.js';

const router = Router();

// Strict limiter on auth endpoints — brute-force protection.
// Generous enough that 500 real signups spread over minutes pass easily,
// but blocks rapid automated abuse from a single IP.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 50, // 50 requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many attempts, please try again later' },
});

// Extra-strict limiter for password reset / OTP resend (spec Part E)
const sensitiveLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many attempts, please try again later' },
});

router.post('/signup', authLimiter, signupValidator, validate, signup);
router.post('/verify-otp', authLimiter, verifyOtpValidator, validate, verifyOtp);
router.post('/resend-otp', sensitiveLimiter, resendOtpValidator, validate, resendOtp);
router.post('/login', authLimiter, loginValidator, validate, login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', protect, getMe);

// ── Password reset (spec C7 / C8) ──
router.post(
  '/forgot-password',
  sensitiveLimiter,
  forgotPasswordValidator,
  validate,
  forgotPassword
);
router.post(
  '/reset-password/:token',
  sensitiveLimiter,
  resetPasswordValidator,
  validate,
  resetPassword
);

// ── OAuth (spec D3) ──
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);
router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth_failed`,
  }),
  oauthSuccess('google')
);

router.get('/github', passport.authenticate('github', { scope: ['user:email'], session: false }));
router.get(
  '/github/callback',
  passport.authenticate('github', {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth_failed`,
  }),
  oauthSuccess('github')
);

export default router;