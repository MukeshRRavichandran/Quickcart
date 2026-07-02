import Review from '../models/review.js';
import Product from '../models/product.js';

// GET /api/reviews/product/:productId  (public)
export const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).sort({ createdAt: -1 });
    return res.json(reviews);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// POST /api/reviews  { productId, rating, comment }
export const createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    if (!productId || !rating || !comment) {
      return res.status(400).json({ message: 'productId, rating and comment are required' });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const existing = await Review.findOne({ product: productId, user: req.user._id });
    if (existing) return res.status(400).json({ message: 'You have already reviewed this product' });

    const review = await Review.create({
      product:  productId,
      user:     req.user._id,
      userName: req.user.name,
      rating:   Number(rating),
      comment,
    });

    // Recalculate product average rating
    const allReviews = await Review.find({ product: productId });
    const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    product.rating       = parseFloat(avg.toFixed(1));
    product.reviewsCount = allReviews.length;
    await product.save();

    return res.status(201).json(review);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// GET /api/reviews/seller  — Reviews on seller's products
export const getSellerReviews = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id }).select('_id');
    const productIds = products.map(p => p._id);

    const reviews = await Review.find({ product: { $in: productIds } })
      .populate('product', 'name image')
      .sort({ createdAt: -1 });

    const formatted = reviews.map(r => ({
      id:       r._id,
      product:  r.product ? r.product.name : 'Unknown Product',
      customer: r.userName,
      rating:   r.rating,
      comment:  r.comment,
      date:     new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      reply:    r.reply || '',
    }));

    return res.json(formatted);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// POST /api/reviews/:id/reply  — Seller replies to a review
export const replyToReview = async (req, res) => {
  try {
    const { reply } = req.body;
    if (!reply) return res.status(400).json({ message: 'reply text is required' });

    const review = await Review.findById(req.params.id).populate('product');
    if (!review) return res.status(404).json({ message: 'Review not found' });

    const isProductOwner = review.product && review.product.seller &&
      review.product.seller.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin' || req.user.role === 'sub-admin';

    if (!isProductOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to reply to this review' });
    }

    review.reply = reply;
    await review.save();
    return res.json(review);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};
