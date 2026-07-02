import Cart from '../models/cart.js';

// GET /api/cart
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }
    // Purge items whose product was deleted
    cart.items = cart.items.filter(item => item.product != null);
    await cart.save();
    return res.json(cart);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// POST /api/cart  { productId, quantity }
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId) return res.status(400).json({ message: 'productId is required' });

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

    const idx = cart.items.findIndex(i => i.product.toString() === productId);
    if (idx > -1) {
      cart.items[idx].quantity = Number(quantity) || 1;
    } else {
      cart.items.push({ product: productId, quantity: Number(quantity) || 1 });
    }

    await cart.save();
    const populated = await Cart.findById(cart._id).populate('items.product');
    return res.json(populated);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// PUT /api/cart/:productId  { quantity }
export const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const idx = cart.items.findIndex(i => i.product.toString() === productId);
    if (idx === -1) return res.status(404).json({ message: 'Product not in cart' });

    cart.items[idx].quantity = Number(quantity);
    await cart.save();

    const populated = await Cart.findById(cart._id).populate('items.product');
    return res.json(populated);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// DELETE /api/cart/:productId
export const removeCartItem = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(i => i.product.toString() !== productId);
    await cart.save();

    const populated = await Cart.findById(cart._id).populate('items.product');
    return res.json(populated);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
