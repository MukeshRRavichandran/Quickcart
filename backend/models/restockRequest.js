import mongoose from 'mongoose';

const restockRequestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    email: { type: String, required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'notified'], default: 'pending' },
    history: [{
      status: String,
      date: { type: Date, default: Date.now }
    }],
  },
  { timestamps: true }
);

restockRequestSchema.index({ product: 1, status: 1 });
restockRequestSchema.index({ seller: 1, status: 1 });

export default mongoose.model('RestockRequest', restockRequestSchema);
