import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    fileId: {
      type: String, // ImageKit fileId — needed for deletion
      required: true,
    },
    caption: {
      type: String,
      trim: true,
      maxlength: 200,
      default: '',
    },
    eventRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      default: null,
      index: true, // fast filter-by-event queries
    },
  },
  { timestamps: true }
);

export default mongoose.model('Gallery', gallerySchema);