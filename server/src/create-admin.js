/**
 * Safe production admin bootstrap — creates or updates a single admin user.
 * Unlike seeder.js, this NEVER deletes any data (your OAuth users are safe).
 *
 * Usage:
 *   node src/create-admin.js                                  → admin@club.com / admin12345
 *   node src/create-admin.js you@email.com StrongPass "Name"  → custom admin
 *
 * If the email already exists (e.g. signed up via Google/GitHub), it is
 * promoted to admin, linked to local auth with the given password, and
 * marked verified — nothing else is touched.
 */
import 'dotenv/config';

import mongoose from 'mongoose';
import connectDB from './config/db.js';
import User from './models/User.js';

const [email = 'admin@club.com', password = 'admin12345', name = 'Club Admin'] =
  process.argv.slice(2);

const createAdmin = async () => {
  await connectDB();

  const existing = await User.findOne({ email: email.toLowerCase() });

  if (existing) {
    existing.role = 'admin';
    existing.authProvider = 'local';
    existing.password = password; // hashed by pre-save hook
    existing.isVerified = true;
    existing.name = existing.name || name;
    await existing.save();
    console.log(`✅ Existing user promoted to admin: ${existing.email}`);
  } else {
    await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: 'admin',
      authProvider: 'local',
      isVerified: true,
    });
    console.log(`✅ Admin created: ${email}`);
  }

  console.log(`🔑 Login: ${email} / ${password}`);
  await mongoose.connection.close();
};

createAdmin().catch((err) => {
  console.error('❌ Failed:', err.message);
  process.exit(1);
});
