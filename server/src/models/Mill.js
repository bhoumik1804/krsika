import mongoose from 'mongoose';

const millSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Mill name is required'],
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'Mill code is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    pincode: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    gstNumber: {
      type: String,
      uppercase: true,
      trim: true,
    },
    panNumber: {
      type: String,
      uppercase: true,
      trim: true,
    },
    
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended', 'pending'],
      default: 'pending',
    },
    
    // Subscription
    subscriptionPlan: {
      type: String,
      enum: ['basic', 'professional', 'enterprise'],
    },
    subscriptionExpiresAt: {
      type: Date,
    },
    
    // Owner (mill-admin who owns this mill)
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner is required'],
    },
    
    // Audit
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
millSchema.index({ code: 1 });
millSchema.index({ ownerId: 1 });
millSchema.index({ status: 1 });

const Mill = mongoose.model('Mill', millSchema);

export default Mill;
