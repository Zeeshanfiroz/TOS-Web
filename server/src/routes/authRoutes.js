import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
  signup,
  login,
  logout,
  getMe,
  verifyOtp,
  resendOtp,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  signupValidator,
  loginValidator,
  verifyOtpValidator,
  resendOtpValidator,
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

router.post('/signup', authLimiter, signupValidator, validate, signup);
router.post('/verify-otp', authLimiter, verifyOtpValidator, validate, verifyOtp);
router.post('/resend-otp', authLimiter, resendOtpValidator, validate, resendOtp);
router.post('/login', authLimiter, loginValidator, validate, login);
router.post('/logout', logout);
router.get('/me', protect, getMe);

export default router;