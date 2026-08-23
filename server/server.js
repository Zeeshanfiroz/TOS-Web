// Load .env FIRST — must be the very first import so every module
// (mailer, db, imagekit...) sees the environment variables.
import 'dotenv/config';

import app from './src/app.js';
import connectDB from './src/config/db.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT} (${process.env.NODE_ENV})`);
  });

  // Graceful shutdown — finish in-flight requests before exiting
  const shutdown = (signal) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 10000).unref();
  };
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};

startServer();