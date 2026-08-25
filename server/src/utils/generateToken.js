import crypto from 'crypto';
import jwt from 'jsonwebtoken';

// Unique JWT ID on every token. Without this, two tokens issued for the
// same user within the same second are BYTE-IDENTICAL (same id + same
// `iat`, which has 1s resolution) — which defeats refresh token rotation:
// a "rotated" token can be identical to the one it replaced, so replay
// detection never fires. (Also general security best practice.)
const jti = () => crypto.randomUUID();

/**
 * Access token — short-lived (1h), sent as httpOnly cookie AND returned
 * in responses (for OAuth redirect flow).
 */
export const generateAccessToken = (id) =>
  jwt.sign({ id, jti: jti() }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  });

/**
 * Refresh token — long-lived (7d), ALWAYS httpOnly cookie.
 * Uses a separate secret so a leaked access secret can't forge refreshes.
 */
export const generateRefreshToken = (id) =>
  jwt.sign({ id, jti: jti() }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });

/**
 * Backwards-compatible default export (legacy 7d token).
 */
const generateToken = (id) =>
  jwt.sign({ id, jti: jti() }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

export default generateToken;
