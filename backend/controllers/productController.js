import Product from '../models/product.js';

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
    const product = await Product.findById(req.params.id).populate('seller', 'name storeName');
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
    if (isOrganic === true  && !finalTags.includes('Organic'))   finalTags.push('Organic');
    if (isOrganic === false) finalTags = finalTags.filter(t => t !== 'Organic');
    if (isFeatured === true) {
      if (!finalTags.includes('Bestseller')) finalTags.push('Bestseller');
      if (!finalTags.includes('Fresh Pick')) finalTags.push('Fresh Pick');
    }
    if (isFeatured === false) finalTags = finalTags.filter(t => t !== 'Bestseller' && t !== 'Fresh Pick');

    if (name !== undefined)          product.name          = name;
    if (description !== undefined)   product.description   = description;
    if (price !== undefined)         product.price         = Number(price);
    if (originalPrice !== undefined) product.originalPrice = Number(originalPrice);
    if (category !== undefined)      product.category      = category;
    if (image !== undefined)         product.image         = image;
    if (unit !== undefined)          product.unit          = unit;
    if (stock !== undefined)         product.stock         = Number(stock);
    if (sku !== undefined)           product.sku           = sku;
    if (expiryDate !== undefined)    product.expiryDate    = expiryDate;
    if (isActive !== undefined)      product.isActive      = Boolean(isActive);
    product.tags = finalTags;

    const updated = await product.save();
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
