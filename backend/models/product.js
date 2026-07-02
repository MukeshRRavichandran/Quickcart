import mongoose from 'mongoose';

const CATEGORIES = [
  'Fruits & Vegetables',
  'Dairy & Eggs',
  'Rice, Atta & Grains',
  'Spices, Oils & Cooking Essentials',
  'Bakery',
  'Snacks & Biscuits',
  'Beverages',
  'Instant, Ready-to-Cook & Ready-to-Eat',
  'Meat, Fish & Seafood',
  'Sweets, Chocolates & Desserts',
];

const nutritionalSchema = new mongoose.Schema(
  {
    calories:          { type: String, default: '' },
    totalFat:          { type: String, default: '' },
    saturatedFat:      { type: String, default: '' },
    totalCarbohydrate: { type: String, default: '' },
    dietaryFiber:      { type: String, default: '' },
    protein:           { type: String, default: '' },
    potassium:         { type: String, default: '' },
    vitaminK:          { type: String, default: '' },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name:            { type: String, required: true, trim: true },
    description:     { type: String, required: true },
    price:           { type: Number, required: true, min: 0 },
    originalPrice:   { type: Number, required: true, min: 0 },
    category:        { type: String, required: true, enum: CATEGORIES },
    image:           { type: String, required: true },
    unit:            { type: String, required: true },
    stock:           { type: Number, required: true, default: 0, min: 0 },
    sku:             { type: String, default: '' },
    expiryDate:      { type: Date },
    tags:            { type: [String], default: [] },
    nutritionalFacts: nutritionalSchema,
    rating:          { type: Number, default: 0, min: 0, max: 5 },
    reviewsCount:    { type: Number, default: 0, min: 0 },
    soldCount:       { type: Number, default: 0, min: 0 },
    isActive:        { type: Boolean, default: true },
    approvalStatus:  { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' },
    seller:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

// Index for search performance
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, approvalStatus: 1, isActive: 1 });

export default mongoose.model('Product', productSchema);
