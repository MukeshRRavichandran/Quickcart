import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name:     { type: String, required: true },
    price:    { type: Number, required: true },
    quantity: { type: Number, required: true },
    image:    { type: String, required: true },
    seller:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { _id: false }
);

const shippingAddressSchema = new mongoose.Schema(
  {
    name:    { type: String, required: true },
    address: { type: String, required: true },
    city:    { type: String, required: true },
    state:   { type: String, required: true },
    zipCode: { type: String, required: true },
    phone:   { type: String, required: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user:            { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items:           { type: [orderItemSchema], required: true },
    shippingAddress: { type: shippingAddressSchema, required: true },
    shippingMethod:  { type: String, enum: ['Standard Delivery', 'Express Overnight'], default: 'Standard Delivery' },
    paymentMethod:   { type: String, default: 'Card' },
    subtotal:        { type: Number, required: true },
    shippingCost:    { type: Number, default: 0 },
    tax:             { type: Number, default: 0 },
    total:           { type: Number, required: true },
    promoCode:       { type: String, default: '' },
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Packed', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'],
      default: 'Pending',
    },
    courierPartner: { type: String, default: '' },
  },
  { timestamps: true }
);

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ 'items.seller': 1 });

export default mongoose.model('Order', orderSchema);
