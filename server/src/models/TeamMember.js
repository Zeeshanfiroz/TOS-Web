import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: 120,
    },
    position: {
      type: String,
      required: [true, 'Position is required'],
      trim: true,
      maxlength: 120,
    },
    group: {
      type: String,
      required: [true, 'Group is required'],
      trim: true,
      maxlength: 60,
      default: 'Core Team',
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 400,
      default: '',
    },
    photoUrl: {
      type: String,
      default: '',
    },
    photoFileId: {
      type: String,
      default: '',
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

teamMemberSchema.index({ group: 1, order: 1, createdAt: -1 });

export default mongoose.model('TeamMember', teamMemberSchema);
