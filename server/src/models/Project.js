import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: 150,
    },
    summary: {
      type: String,
      required: [true, 'Project summary is required'],
      trim: true,
      maxlength: 220,
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
    },
    category: {
      type: String,
      required: [true, 'Project category is required'],
      trim: true,
      maxlength: 80,
    },
    tags: [{ type: String, trim: true }],
    banner: { url: String, fileId: String },
    gallery: [
      {
        url: { type: String, required: true },
        fileId: { type: String, required: true },
      },
    ],
    status: {
      type: String,
      enum: ['active', 'completed'],
      default: 'active',
      index: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

projectSchema.index({ createdAt: -1 });

export default mongoose.model('Project', projectSchema);
