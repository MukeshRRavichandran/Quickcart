import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import Cart from '../models/cart.js';
import Wishlist from '../models/wishlist.js';

const JWT_SECRET = process.env.JWT_SECRET || 'quickcartsecret12345';

const signToken = (id) =>
  jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });

// Format user for API response (never expose password)
const formatUser = (user, token) => ({
  _id:           user._id,
  name:          user.name,
  email:         user.email,
  role:          user.role,
  storeName:     user.storeName,
  isApproved:    user.isApproved,
  isBlocked:     user.isBlocked,
  phone:         user.phone,
  hours:         user.hours,
  description:   user.description,
  logo:          user.logo,
  banner:        user.banner,
  gstin:         user.gstin,
  bankName:      user.bankName,
  bankAccount:   user.bankAccount,
  routingNumber: user.routingNumber,
  address:       user.address,
  ...(token ? { token } : {}),
});

// POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, storeName, gstin, bankName, bankAccount, routingNumber, phone, address, aadhaarFile, panFile, licenseFile } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    const exists = await User.findOne({ email: email.toLowerCase().trim() });
    if (exists) return res.status(400).json({ message: 'An account with this email already exists' });

    const isApproved = role === 'seller' ? false : true;

    const user = await User.create({ 
      name, 
      email, 
      password, 
      role: role || 'customer', 
      storeName: storeName || '', 
      isApproved,
      gstin: gstin || '',
      bankName: bankName || '',
      bankAccount: bankAccount || '',
      routingNumber: routingNumber || '',
      phone: phone || '',
      address: address || {},
      aadhaarFile: aadhaarFile || '',
      panFile: panFile || '',
      licenseFile: licenseFile || ''
    });

    // Bootstrap cart and wishlist for every new user
    await Promise.all([
      Cart.create({ user: user._id, items: [] }),
      Wishlist.create({ user: user._id, products: [] }),
    ]);

    return res.status(201).json(formatUser(user, signToken(user._id)));
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    if (user.isBlocked) return res.status(403).json({ message: 'Your account has been suspended by administration.' });
    if (user.role === 'seller' && !user.isApproved)
      return res.status(403).json({ message: 'Your seller account is pending admin approval.' });

    const match = await user.matchPassword(password);
    if (!match) return res.status(401).json({ message: 'Invalid email or password' });

    // Ensure cart & wishlist exist
    await Promise.all([
      Cart.findOneAndUpdate({ user: user._id }, {}, { upsert: true, setDefaultsOnInsert: true }),
      Wishlist.findOneAndUpdate({ user: user._id }, {}, { upsert: true, setDefaultsOnInsert: true }),
    ]);

    return res.json(formatUser(user, signToken(user._id)));
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// GET /api/auth/me
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json(formatUser(user));
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// PUT /api/auth/profile
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Common fields
    if (req.body.name)  user.name  = req.body.name;
    if (req.body.email) user.email = req.body.email;
    if (req.body.password) user.password = req.body.password; // pre-save hook hashes it

    // Customer address
    if (req.body.address) {
      user.address = {
        name:    req.body.address.name    ?? user.address.name,
        address: req.body.address.address ?? user.address.address,
        city:    req.body.address.city    ?? user.address.city,
        state:   req.body.address.state   ?? user.address.state,
        zipCode: req.body.address.zipCode ?? user.address.zipCode,
        phone:   req.body.address.phone   ?? user.address.phone,
      };
    }

    // Seller-specific fields
    if (user.role === 'seller') {
      const fields = ['storeName', 'phone', 'hours', 'description', 'logo', 'banner', 'gstin', 'bankName', 'bankAccount', 'routingNumber'];
      fields.forEach(f => { if (req.body[f] !== undefined) user[f] = req.body[f]; });
    }

    const updated = await user.save();
    return res.json(formatUser(updated));
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
