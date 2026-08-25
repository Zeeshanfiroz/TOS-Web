import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: 80,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // never return password in queries by default
      // required ONLY for local provider — enforced by validator below
    },
    authProvider: {
      type: String,
      enum: ['local', 'google', 'github'],
      default: 'local',
    },
    googleId: { type: String, index: true },
    githubId: { type: String, index: true },
    role: {
      type: String,
      enum: ['member', 'admin'],
      default: 'member',
    },
    isVerified: { type: Boolean, default: false },
    otp: {
      code: { type: String, select: false },
      expiresAt: { type: Date, select: false },
      attempts: { type: Number, default: 0, select: false }, // brute-force counter
    },
    resetPasswordToken: { type: String, select: false }, // stored hashed
    resetPasswordExpiry: { type: Date, select: false },
    lastLogin: { type: Date },
    avatar: { url: String, fileId: String },
    joinedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Hash password before save (only when modified AND local provider —
// OAuth users have no password)
userSchema.pre('save', async function () {
  if (!this.isModified('password') || this.authProvider !== 'local') return;
  if (!this.password) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Password is mandatory only for local-provider accounts
userSchema.path('password').validate(function (v) {
  if (this.authProvider === 'local' && (!v || v.length < 8)) {
    return false;
  }
  return true;
}, 'Password must be at least 8 characters');

// Instance method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);