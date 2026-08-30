import 'dotenv/config';

import mongoose from 'mongoose';
import connectDB from './config/db.js';
import User from './models/User.js';
import Event from './models/Event.js';
import Announcement from './models/Announcement.js';

const daysFromNow = (days) => new Date(Date.now() + days * 24 * 60 * 60 * 1000);

const seed = async () => {
  await connectDB();

  // Wipe existing data
  await Promise.all([
    User.deleteMany(),
    Event.deleteMany(),
    Announcement.deleteMany(),
  ]);
  console.log('🧹 Existing data cleared');

  // Admin + sample members
  // Seeded users are pre-verified so you can log in immediately
  const admin = await User.create({
    name: 'Club Admin',
    email: 'admin@club.com',
    password: 'admin12345',
    role: 'admin',
    isVerified: true,
  });
  const member = await User.create({
    name: 'Sample Member',
    email: 'member@club.com',
    password: 'member12345',
    isVerified: true,
  });
  console.log('👤 Users created (admin@club.com / admin12345)');

  // Events — mix of upcoming and past
  const events = await Event.create([
    {
      title: 'Tree Plantation Drive',
      description:
        'Join us as we plant 200 saplings around campus. Gloves, tools and saplings provided — just bring yourself and water!',
      date: daysFromNow(14),
      location: 'Main Campus Lawn',
    },
    {
      title: 'E-Waste Collection Week',
      description:
        'Drop off old phones, chargers, batteries and electronics at collection points across campus. Everything is recycled responsibly.',
      date: daysFromNow(30),
      location: 'Library Entrance & Cafeteria Gate',
    },
    {
      title: 'Campus Cleanliness Marathon',
      description:
        'A fun team event — clean-up relay across campus zones followed by refreshments and prizes for the best teams.',
      date: daysFromNow(45),
      location: 'Sports Complex',
    },
    {
      title: 'Plastic-Free Awareness Workshop',
      description:
        'Interactive workshop on reducing single-use plastics in daily college life. Free cloth bags for all attendees.',
      date: daysFromNow(-20),
      location: 'Auditorium Hall B',
    },
    {
      title: 'Green Campus Audit',
      description:
        'Students audited energy usage, waste segregation and water consumption across all departments.',
      date: daysFromNow(-50),
      location: 'All Departments',
    },
  ]);

  // RSVP member to first two events
  events[0].rsvps.push({ user: member._id });
  events[1].rsvps.push({ user: member._id });
  await Promise.all(events.map((e) => e.save()));

  // Announcements
  const announcementDocs = [
    {
      title: 'Club Launch — Registrations Open! 🌱',
      content:
        'Our sustainability club is officially live! Register now to participate in tree plantation drives, e-waste collections and much more. First 100 members get a free plant kit.',
      author: admin._id,
    },
    {
      title: 'New Recycling Bins Installed Across Campus',
      content:
        'Thanks to our partnership with the college administration, colour-coded recycling bins are now available at every block. Blue = paper, Green = organic, Yellow = plastic/metal.',
      author: admin._id,
    },
    {
      title: 'Volunteer of the Month — Nominations Open',
      content:
        'Know someone who went above and beyond this month? Nominate them for Volunteer of the Month by messaging us through the contact page.',
      author: admin._id,
    },
  ];
  await Announcement.insertMany(announcementDocs);

  console.log('✅ Seed complete!');
  console.log('   Events:', events.length);
  console.log('   Announcements:', announcementDocs.length);
  console.log('🔑 Login credentials:');
  console.log('   Admin : admin@club.com / admin12345');
  console.log('   Member: member@club.com / member12345');
  console.warn(
    '\n⚠️  WARNING: These are PUBLIC, well-known seeded credentials!\n' +
      '   Before going live, either rotate them (login → change password)\n' +
      '   or use `npm run create-admin you@email.com StrongPass "Name"`\n' +
      '   and DELETE the seeded admin@club.com account. Anyone who reads\n' +
      '   this repo can log in as admin with the defaults otherwise!'
  );

  mongoose.connection.close();
};

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});