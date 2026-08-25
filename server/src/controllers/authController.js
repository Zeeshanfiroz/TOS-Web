import User from '../models/User.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import {
  generateAccessToken,
  generateRefreshToken,
} from '../utils/generateToken.js';
import { sendEmail } from '../config/mailer.js';

const COOKIE_NAME = 'token';
const REFRESH_COOKIE_NAME = 'refreshToken';
const OTP_TTL_MINUTES = 10;
const MAX_OTP_ATTEMPTS = 5;
const RESET_TOKEN_TTL_MINUTES = 30;

// Cookie options — httpOnly so JS can't steal the token (XSS protection)
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');

/**
 * Issue the full token pair (spec C4.5-6) with REFRESH TOKEN ROTATION:
 *  - Access token (1h): httpOnly cookie + returned in body (OAuth redirect)
 *  - Refresh token (7d): httpOnly cookie, its sha256 hash stored on the
 *    user. Reuse of an old refresh token = replay/theft → session revoked.
 */
const issueTokens = async (user, res) => {
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshTokenHash = sha256(refreshToken);
  user.lastLogin = new Date();
  await user.save();

  res.cookie(COOKIE_NAME, accessToken, {
    ...cookieOptions,
    maxAge: 60 * 60 * 1000, // 1 hour
  });
  res.cookie(REFRESH_COOKIE_NAME, refreshToken, cookieOptions);

  return accessToken;
};

/**
 * Generate a 6-digit OTP using a cryptographically secure RNG.
 * (Math.random() is predictable — #114 Insecure Randomness)
 */
const generateOtpCode = () => crypto.randomInt(100000, 1000000).toString();

/**
 * Generate an OTP, store it on the user (with attempt counter + expiry) and email it.
 * In development the OTP is also logged to the console so you can test
 * without a working SMTP connection.
 */
const issueOtp = async (user) => {
  const code = generateOtpCode();
  user.otp = {
    code,
    expiresAt: new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000),
    attempts: 0,
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

  const user = await User.findOne({ email }).select('+otp.code +otp.expiresAt +otp.attempts');
  if (!user) {
    return res.status(404).json({ success: false, message: 'Account not found' });
  }
  if (user.isVerified) {
    return res.status(400).json({ success: false, message: 'Account already verified — please login' });
  }

  // Brute-force guard: too many wrong attempts invalidates the OTP (#51)
  if ((user.otp?.attempts || 0) >= MAX_OTP_ATTEMPTS) {
    user.otp = undefined;
    await user.save();
    return res.status(429).json({
      success: false,
      message: 'Too many wrong attempts. Please request a new OTP.',
    });
  }

  if (
    !user.otp?.code ||
    user.otp.code !== String(otp).trim() ||
    new Date(user.otp.expiresAt) < new Date()
  ) {
    // Count the failed attempt against this account
    if (user.otp?.code) {
      user.otp.attempts = (user.otp.attempts || 0) + 1;
      await user.save();
    }
    return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
  }

  user.isVerified = true;
  user.otp = undefined;
  await user.save();

  // Log them in right away (access + refresh tokens)
  const accessToken = await issueTokens(user, res);

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
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      accessToken,
    },
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
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  // OAuth users have no password — point them to the right flow
  if (user.authProvider !== 'local') {
    return res.status(400).json({
      success: false,
      message: `This account uses ${user.authProvider} login. Please continue with ${user.authProvider}.`,
    });
  }

  if (!(await user.matchPassword(password))) {
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

  const accessToken = await issueTokens(user, res);

  res.json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      accessToken,
    },
  });
};

/**
 * POST /api/auth/logout — clears both cookies AND invalidates the stored
 * refresh hash, so the (still-unexpired) refresh token can't be replayed.
 */
export const logout = async (req, res) => {
  const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME];
  if (refreshToken) {
    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
      );
      await User.updateOne(
        { _id: decoded.id },
        { $unset: { refreshTokenHash: 1 } }
      );
    } catch {
      // invalid/expired token — nothing to invalidate
    }
  }

  const clearOpts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  };
  res.clearCookie(COOKIE_NAME, clearOpts);
  res.clearCookie(REFRESH_COOKIE_NAME, clearOpts);
  res.json({ success: true, message: 'Logged out' });
};

/**
 * POST /api/auth/refresh (spec C5) — with REFRESH TOKEN ROTATION:
 *  1. Verify the refresh token's signature + expiry
 *  2. Compare its sha256 hash with the one stored on the user — a mismatch
 *     means an old/rotated token was REUSED (theft/replay) → revoke session
 *  3. On success: rotate — issue a NEW refresh token (new hash stored) and a
 *     fresh access token
 */
export const refresh = async (req, res) => {
  const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME];
  if (!refreshToken) {
    return res.status(401).json({ success: false, message: 'No refresh token' });
  }

  let decoded;
  try {
    decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
    );
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
  }

  const user = await User.findById(decoded.id).select('+refreshTokenHash');
  if (!user) {
    return res.status(401).json({ success: false, message: 'User no longer exists' });
  }

  // Replay detection: the presented token must match the stored hash.
  // If not, this token was already rotated away → likely theft → revoke.
  if (!user.refreshTokenHash || user.refreshTokenHash !== sha256(refreshToken)) {
    user.refreshTokenHash = undefined; // kill the session entirely
    await user.save();
    res.clearCookie(COOKIE_NAME, cookieOptions);
    res.clearCookie(REFRESH_COOKIE_NAME, cookieOptions);
    return res.status(401).json({
      success: false,
      message: 'Session revoked due to suspicious activity. Please login again.',
    });
  }

  // Rotate: new refresh token (new stored hash) + fresh access token
  const accessToken = generateAccessToken(user._id);
  const newRefreshToken = generateRefreshToken(user._id);
  user.refreshTokenHash = sha256(newRefreshToken);
  await user.save();

  res.cookie(COOKIE_NAME, accessToken, {
    ...cookieOptions,
    maxAge: 60 * 60 * 1000, // 1 hour
  });
  res.cookie(REFRESH_COOKIE_NAME, newRefreshToken, cookieOptions);

  res.json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      accessToken,
    },
  });
};

/**
 * POST /api/auth/forgot-password (spec C7)
 * Always responds success (never reveals whether the email exists).
 */
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (user && user.authProvider === 'local') {
    // Raw token goes in the email link; only the HASH is stored (spec C7.2)
    const rawToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(rawToken).digest('hex');
    user.resetPasswordExpiry = new Date(Date.now() + RESET_TOKEN_TTL_MINUTES * 60 * 1000);
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${rawToken}`;
    sendEmail(
      user.email,
      'Reset Your Password 🌱',
      `<h2>Password Reset Request</h2>
       <p>Hi ${user.name}, click the link below to reset your password.
       This link expires in ${RESET_TOKEN_TTL_MINUTES} minutes:</p>
       <p><a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#16a34a;color:#fff;border-radius:8px;text-decoration:none;">Reset Password</a></p>
       <p style="color:#888;font-size:13px;">If you didn't request this, you can safely ignore this email.</p>`
    );
  }

  res.json({
    success: true,
    message: 'If that account exists, a password reset link has been sent.',
  });
};

/**
 * POST /api/auth/reset-password/:token (spec C8)
 */
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const hashed = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken: hashed,
    resetPasswordExpiry: { $gt: new Date() },
    authProvider: 'local',
  }).select('+resetPasswordToken +resetPasswordExpiry +password');

  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'Reset link is invalid or has expired. Please request a new one.',
    });
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpiry = undefined;
  await user.save();

  res.json({
    success: true,
    message: 'Password reset successful! Please login with your new password.',
  });
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

/**
 * OAuth callback handler (spec D3) — after passport authenticates:
 * issue tokens, set refresh cookie, redirect to frontend with access token.
 */
export const oauthSuccess = (provider) => async (req, res) => {
  if (!req.user) {
    return res.redirect(`${process.env.CLIENT_URL}/login?error=oauth_failed`);
  }
  const accessToken = await issueTokens(req.user, res);
  res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${accessToken}`);
};