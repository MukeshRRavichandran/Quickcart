import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const JWT_SECRET = process.env.JWT_SECRET || 'quickcartsecret12345';

// ── Authenticate any logged-in user ──────────────────────────────────────────
export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) return res.status(401).json({ message: 'Not authorized, user not found' });
    if (user.isBlocked) return res.status(403).json({ message: 'Your account has been suspended.' });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized, token invalid or expired' });
  }
};

// ── Optionally Authenticate user ──────────────────────────────────────────
export const optionalProtect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (user && !user.isBlocked) {
      req.user = user;
    }
  } catch (err) {
    // ignore
  }
  next();
};

// ── Require admin or sub-admin ────────────────────────────────────────────────
export const admin = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'sub-admin')) return next();
  res.status(403).json({ message: 'Not authorized as admin' });
};

// ── Require seller (or admin impersonating seller) ────────────────────────────
export const seller = (req, res, next) => {
  if (req.user && (req.user.role === 'seller' || req.user.role === 'admin')) {
    if (req.user.role === 'seller' && !req.user.isApproved) {
      return res.status(403).json({ message: 'Your seller account is pending admin approval.' });
    }
    return next();
  }
  res.status(403).json({ message: 'Not authorized as seller' });
};
