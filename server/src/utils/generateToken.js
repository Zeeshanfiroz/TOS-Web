import jwt from 'jsonwebtoken';

/**
 * Access token — short-lived (1h), sent as httpOnly cookie AND returned
 * in responses (for OAuth redirect flow).
 */
export const generateAccessToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  });

/**
 * Refresh token — long-lived (7d), ALWAYS httpOnly cookie.
 * Uses a separate secret so a leaked access secret can't forge refreshes.
 */
export const generateRefreshToken = (id) =>
  jwt.sign({ id }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });

/**
 * Backwards-compatible default export (legacy 7d token).
 */
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

export default generateToken;
