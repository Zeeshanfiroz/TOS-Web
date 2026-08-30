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
  },
  { timestamps: true }
);

// Fast lookup of a user's RSVP inside an event
eventSchema.index({ 'rsvps.user': 1 });

// Text search on title for the events search box
eventSchema.index({ title: 'text', description: 'text' });

export default mongoose.model('Event', eventSchema);