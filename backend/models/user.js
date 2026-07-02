import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name:          { type: String, required: true, trim: true },
    email:         { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:      { type: String, required: true },
    role:          { type: String, enum: ['customer', 'seller', 'admin', 'sub-admin'], default: 'customer' },
    storeName:     { type: String, default: '' },
    isBlocked:     { type: Boolean, default: false },
    isApproved:    { type: Boolean, default: true },
    // Seller-specific profile fields
    phone:         { type: String, default: '' },
    hours:         { type: String, default: '' },
    description:   { type: String, default: '' },
    logo:          { type: String, default: '' },
    banner:        { type: String, default: '' },
    gstin:         { type: String, default: '' },
    bankName:      { type: String, default: '' },
    bankAccount:   { type: String, default: '' },
    routingNumber: { type: String, default: '' },
    // Customer shipping address
    address: {
      name:    { type: String, default: '' },
      address: { type: String, default: '' },
      city:    { type: String, default: '' },
      state:   { type: String, default: '' },
      zipCode: { type: String, default: '' },
      phone:   { type: String, default: '' },
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with stored hash
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);
