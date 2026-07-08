import Product from '../models/product.js';
import RestockRequest from '../models/restockRequest.js';
import Notification from '../models/notification.js';

// GET /api/products  (public — customers browse)
export const getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    const query = { isActive: true, approvalStatus: 'approved' };

    if (category && category !== 'All' && category.trim() !== '') {
      query.category = category;
    }
    if (search && search.trim() !== '') {
      query.name = { $regex: search.trim(), $options: 'i' };
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    return res.json(products);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// GET /api/products/seller  (seller sees their own products)
export const getSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id }).sort({ createdAt: -1 });
    return res.json(products);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// GET /api/products/:id  (public)
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('seller', 'name storeName shopAddress phone email');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    return res.json(product);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// POST /api/products  (seller creates product)
export const createSellerProduct = async (req, res) => {
  try {
    const {
      name, description, price, originalPrice, category,
      image, unit, stock, sku, expiryDate, tags, isOrganic, isFeatured,
    } = req.body;

    const finalTags = Array.isArray(tags) ? [...tags] : [];
    if (!finalTags.includes('Bestseller')) finalTags.push('Bestseller');
    if (!finalTags.includes('Fresh Pick')) finalTags.push('Fresh Pick');
    if (isOrganic && !finalTags.includes('Organic')) finalTags.push('Organic');

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      originalPrice: Number(originalPrice),
      category,
      image,
      unit,
      stock: Number(stock) || 0,
      sku: sku || '',
      expiryDate: expiryDate || null,
      tags: finalTags,
      seller: req.user._id,
      approvalStatus: 'approved',
      isActive: true,
    });

    return res.status(201).json(product);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// PUT /api/products/:id  (seller or admin updates product)
export const updateSellerProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const isOwner = product.seller && product.seller.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to edit this product' });
    }

    const {
      name, description, price, originalPrice, category,
      image, unit, stock, sku, expiryDate, tags, isOrganic, isFeatured, isActive,
    } = req.body;

    let finalTags = Array.isArray(tags) ? [...tags] : [...(product.tags || [])];
    if (isOrganic === true && !finalTags.includes('Organic')) finalTags.push('Organic');
    if (isOrganic === false) finalTags = finalTags.filter(t => t !== 'Organic');
    if (isFeatured === true) {
      if (!finalTags.includes('Bestseller')) finalTags.push('Bestseller');
      if (!finalTags.includes('Fresh Pick')) finalTags.push('Fresh Pick');
    }
    if (isFeatured === false) finalTags = finalTags.filter(t => t !== 'Bestseller' && t !== 'Fresh Pick');

    const oldStock = product.stock;

    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = Number(price);
    if (originalPrice !== undefined) product.originalPrice = Number(originalPrice);
    if (category !== undefined) product.category = category;
    if (image !== undefined) product.image = image;
    if (unit !== undefined) product.unit = unit;
    if (stock !== undefined) product.stock = Number(stock);
    if (sku !== undefined) product.sku = sku || '';
    if (expiryDate !== undefined) product.expiryDate = expiryDate || null;
    if (isActive !== undefined) product.isActive = Boolean(isActive);
    product.tags = finalTags;

    const updated = await product.save();

    // Trigger restock notifications if stock went from 0 to > 0
    if (oldStock === 0 && updated.stock > 0) {
      const pendingRequests = await RestockRequest.find({ product: updated._id, status: 'pending' });
      if (pendingRequests.length > 0) {
        // Filter those with a user account to send in-app notifications
        const withUser = pendingRequests.filter(req => req.user);
        if (withUser.length > 0) {
          const notifications = withUser.map(req => ({
            user: req.user,
            text: `Good news! ${updated.name} is back in stock. Hurry and order before it runs out again!`,
            type: 'stock',
            read: false
          }));
          await Notification.insertMany(notifications);
        }
        
        // Update all requests to notified and append to history
        for (let req of pendingRequests) {
          req.status = 'notified';
          req.history.push({ status: 'notified', date: new Date() });
          await req.save();
        }
      }
    }

    return res.json(updated);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// DELETE /api/products/:id  (seller or admin deletes product)
export const deleteSellerProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const isOwner = product.seller && product.seller.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }

    await product.deleteOne();
    return res.json({ message: 'Product removed successfully' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// POST /api/products/:id/notify (customer requests restock notification)
export const requestRestockNotification = async (req, res) => {
  try {
    const { email } = req.body;
    let finalEmail = email;

    if (req.user) {
      finalEmail = req.user.email;
    }

    if (!finalEmail) {
      return res.status(400).json({ message: 'Email address is required.' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Check if a pending request already exists for this email and product
    const existing = await RestockRequest.findOne({
      email: finalEmail.toLowerCase(),
      product: product._id,
      status: 'pending'
    });

    if (existing) {
      return res.status(400).json({ message: 'You have already requested a notification for this product.' });
    }

    await RestockRequest.create({
      user: req.user ? req.user._id : null,
      email: finalEmail.toLowerCase(),
      product: product._id,
      seller: product.seller,
      status: 'pending',
      history: [{ status: 'pending' }]
    });

    return res.status(201).json({ message: 'We will notify you when this is back in stock!' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// GET /api/products/seller/restock-requests (seller gets aggregated pending restock requests)
export const getSellerRestockRequests = async (req, res) => {
  try {
    const requests = await RestockRequest.aggregate([
      { $match: { seller: req.user._id, status: 'pending' } },
      {
        $group: {
          _id: '$product',
          count: { $sum: 1 },
          users: { $push: '$user' }
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      { $unwind: '$productDetails' },
      { $sort: { count: -1 } }
    ]);

    return res.json(requests);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
