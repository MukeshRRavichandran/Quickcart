import express from 'express';
import { getProductReviews, createReview, getSellerReviews, replyToReview } from '../controllers/reviewController.js';
import { protect, seller } from '../middleware/auth.js';

const router = express.Router();

// ⚠️  /seller must come before /:id
router.get('/seller',           protect, seller, getSellerReviews);  // GET  /api/reviews/seller
router.get('/product/:productId', getProductReviews);                // GET  /api/reviews/product/:productId
router.post('/',                protect, createReview);              // POST /api/reviews
router.post('/:id/reply',       protect, seller, replyToReview);     // POST /api/reviews/:id/reply

export default router;
