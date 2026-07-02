import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    code:          { type: String, required: true, unique: true, uppercase: true, trim: true },
    name:          { type: String, required: true },
    type:          { type: String, enum: ['Percentage', 'Flat'], required: true },
    value:         { type: Number, required: true },
    minOrderValue: { type: Number, default: 0 },
    maxDiscount:   { type: Number, default: null },
    validFrom:     { type: Date, default: null },
    validUntil:    { type: Date, default: null },
    validDays:     { type: [String], default: [] },
    usageLimit:    { type: Number, default: null },
    usedCount:     { type: Number, default: 0 },
    userLimit:     { type: Number, default: 1 },
    usedBy: [
      {
        user:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        usedAt: { type: Date, default: Date.now },
      },
    ],
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  },
  { timestamps: true }
);

export default mongoose.model('Coupon', couponSchema);
