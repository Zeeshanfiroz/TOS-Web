import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { sendEmail } from '../config/mailer.js';

const COOKIE_NAME = 'token';

// Cookie options — httpOnly so JS can't steal the token (XSS protection)
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const OTP_TTL_MINUTES = 10;

/**
 * Generate a 6-digit OTP, store it (hashed expiry) on the user and email it.
 * In development the OTP is also logged to the console so you can test
 * without a working SMTP connection.
 */
const issueOtp = async (user) => {
  const code = String(Math.floor(100000 + Math.random() * 900000));
  user.otp = {
    code,
    expiresAt: new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000),
  };
  await user.save();

  sendEmail(
    user.email,
    'Your Verification Code 🌱',
    `<h2>Verify your email</h2>
     <p>Hi ${user.name}, use this code to verify your account:</p>
     <h1 style="letter-spacing:8px;font-size:32px;margin:16px 0;">${code}</h1>
     <p>This code expires in ${OTP_TTL_MINUTES} minutes. If you didn't request it, ignore this email.</p>`
  );

  // Dev convenience: print OTP so signup can be tested without SMTP
  if (process.env.NODE_ENV !== 'production') {
    console.log(`📧 [DEV] OTP for ${user.email}: ${code}`);
  }
  return code;
};

/**
 * POST /api/auth/signup
 * Creates an unverified account and emails a 6-digit OTP.
 */
export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    if (!existing.isVerified) {
      // Account exists but was never verified — re-send OTP instead of erroring
      await issueOtp(existing);
      return res.status(200).json({
        success: true,
        message: 'Account exists but is not verified. A new OTP has been sent.',
        data: { email, needsVerification: true },
      });
    }
    return res.status(409).json({ success: false, message: 'Email already registered' });
  }

  const user = await User.create({ name, email, password });
  await issueOtp(user);

  res.status(201).json({
    success: true,
    message: 'Account created! Check your email for the verification code.',
    data: { email: user.email, needsVerification: true },
  });
};

/**
 * POST /api/auth/verify-otp   body: { email, otp }
 * Verifies the code, marks the account verified and logs the user in.
 */
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email }).select('+otp.code +otp.expiresAt');
  if (!user) {
    return res.status(404).json({ success: false, message: 'Account not found' });
  }
  if (user.isVerified) {
    return res.status(400).json({ success: false, message: 'Account already verified — please login' });
  }
  if (
    !user.otp?.code ||
    user.otp.code !== String(otp).trim() ||
    new Date(user.otp.expiresAt) < new Date()
  ) {
    return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
  }

  user.isVerified = true;
  user.otp = undefined;
  await user.save();

  // Log them in right away
  res.cookie(COOKIE_NAME, generateToken(user._id), cookieOptions);

  // Welcome email in the background queue
  sendEmail(
    user.email,
    'Welcome to the Sustainability Club! 🌱',
    `<h2>Welcome aboard, ${user.name}! 🌱</h2>
     <p>Your email is verified. You'll now receive updates about events,
     drives and announcements.</p>`
  );

  res.json({
    success: true,
    message: 'Email verified successfully!',
    data: { _id: user._id, name: user.name, email: user.email, role: user.role },
  });
};

/**
 * POST /api/auth/resend-otp   body: { email }
 */
export const resendOtp = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user || user.isVerified) {
    // Don't reveal whether the account exists / is verified
    return res.json({
      success: true,
      message: 'If the account exists and is unverified, a new OTP has been sent.',
    });
  }

  await issueOtp(user);
  res.json({
    success: true,
    message: 'A new OTP has been sent to your email.',
  });
};

/**
 * POST /api/auth/login
 */
export const login = async (req, res) => {
  const { email, password } = req.body;

  // password is select:false in the model, so explicitly include it
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  if (!user.isVerified) {
    // Re-send an OTP so they can complete verification
    await issueOtp(user);
    return res.status(403).json({
      success: false,
      message: 'Please verify your email first. A new OTP has been sent.',
      data: { email: user.email, needsVerification: true },
    });
  }

  res.cookie(COOKIE_NAME, generateToken(user._id), cookieOptions);

  res.json({
    success: true,
    data: { _id: user._id, name: user.name, email: user.email, role: user.role },
  });
};

/**
 * POST /api/auth/logout
 */
export const logout = (req, res) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  });
  res.json({ success: true, message: 'Logged out' });
};

/**
 * GET /api/auth/me  (protected)
 */
export const getMe = (req, res) => {
  res.json({
    success: true,
    data: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      avatar: req.user.avatar,
      joinedAt: req.user.joinedAt,
    },
  });
};