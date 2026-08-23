import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      maxlength: 2000,
    },
    status: {
      type: String,
      enum: ['new', 'resolved'],
      default: 'new',
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Contact', contactSchema);