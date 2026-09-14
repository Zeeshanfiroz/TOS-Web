 import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      maxlength: 150,
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
    },
    date: {
      type: Date,
      required: [true, 'Event date is required'],
      index: true, // fast upcoming/past filtering
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    eventType: {
      type: String,
      enum: ['organized', 'participated'],
      default: 'organized',
      index: true,
    },
    // ── Optional event details (all non-required) ──
    registrationLink: {
      type: String, // Unstop / Google Form / any registration page
      trim: true,
    },
    ruleBookUrl: {
      type: String, // Rule book / brochure PDF link
      trim: true,
    },
    fee: {
      type: String, // e.g. "Free" or "₹50 per team" (string — flexible)
      trim: true,
      maxlength: 100,
    },
    externalLinks: [
      {
        label: { type: String, trim: true, maxlength: 60 },
        url: { type: String, trim: true },
      },
    ],
    banner: { url: String, fileId: String },
    gallery: [
      {
        url: { type: String, required: true },
        fileId: { type: String, required: true },
      },
    ],
    rsvps: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    // Public Q&A — members ask, admins reply (reply emails the asker)
    queries: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        question: { type: String, required: true, trim: true, maxlength: 500 },
        answer: { type: String, trim: true, maxlength: 1000 },
        answeredAt: { type: Date },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// Fast lookup of a user's RSVP inside an event
eventSchema.index({ 'rsvps.user': 1 });

// Text search on title for the events search box
eventSchema.index({ title: 'text', description: 'text' });

export default mongoose.model('Event', eventSchema);