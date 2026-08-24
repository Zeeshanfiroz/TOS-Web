import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import announcementRoutes from './routes/announcementRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { notFound, errorHandler, sanitizeNoSql } from './middleware/error.js';

const app = express();

// Behind Render/Railway proxy — makes req.ip correct for rate limiting
app.set('trust proxy', 1);

// Security headers
app.use(helmet());

// CORS — only allow the frontend origin, with credentials for cookies
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// Gzip compression — faster responses under load
app.use(compression());

// Request logging (skip in production to save resources)
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Global rate limiter — generous: protects against abuse without
// blocking a launch-day burst of real users.
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000, // per IP per 15 min — far above what a real user generates
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

// Body parsers
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Strip Mongo operators ($gt, $ne, dotted keys...) from user input (#82 NoSQL injection)
app.use(sanitizeNoSql);

// Health check (for Render/Railway uptime monitoring)
app.get('/api/health', (req, res) =>
  res.json({
    success: true,
    message: 'API is running 🌱',
    emailConfigured: Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD),
  })
);

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/users', userRoutes);

// 404 + centralized error handler (must be LAST)
app.use(notFound);
app.use(errorHandler);

export default app;