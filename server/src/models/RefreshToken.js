import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const refreshTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    isRevoked: {
      type: Boolean,
      default: false,
    },
    userAgent: {
      type: String,
    },
    ipAddress: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Index for faster queries and automatic cleanup
refreshTokenSchema.index({ token: 1 });
refreshTokenSchema.index({ userId: 1 });
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index

// Hash token before saving
refreshTokenSchema.pre('save', async function(next) {
  if (!this.isModified('token')) {
    return next();
  }
  
  try {
    this.token = await bcrypt.hash(this.token, 10);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare token method
refreshTokenSchema.methods.compareToken = async function(candidateToken) {
  return await bcrypt.compare(candidateToken, this.token);
};

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);

export default RefreshToken;
