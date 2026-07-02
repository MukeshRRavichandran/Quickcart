import Wishlist from '../models/wishlist.js';

// GET /api/wishlist
export const getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }
    // Purge stale product refs
    wishlist.products = wishlist.products.filter(p => p != null);
    await wishlist.save();
    return res.json(wishlist);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// POST /api/wishlist  { productId }
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ message: 'productId is required' });

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) wishlist = await Wishlist.create({ user: req.user._id, products: [] });

    const alreadyAdded = wishlist.products.some(id => id.toString() === productId);
    if (!alreadyAdded) {
      wishlist.products.push(productId);
      await wishlist.save();
    }

    const populated = await Wishlist.findById(wishlist._id).populate('products');
    return res.json(populated);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// DELETE /api/wishlist/:productId
export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' });

    wishlist.products = wishlist.products.filter(id => id.toString() !== productId);
    await wishlist.save();

    const populated = await Wishlist.findById(wishlist._id).populate('products');
    return res.json(populated);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
