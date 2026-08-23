import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * protect — verifies JWT from httpOnly cookie OR Authorization: Bearer header,
 * then attaches the user document to req.user.
 */
export const protect = async (req, res, next) => {
  let token = null;

  // 1) Bearer token (mobile clients / Postman)
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  // 2) httpOnly cookie (browser)
  if (!token && req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'User no longer exists' });
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

/**
 * adminOnly — must be used AFTER protect. Restricts route to admins.
 */
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Admin access only' });
};