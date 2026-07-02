import express from 'express';
import { getWishlist, addToWishlist, removeFromWishlist } from '../controllers/wishlistController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/',              getWishlist);         // GET    /api/wishlist
router.post('/',             addToWishlist);       // POST   /api/wishlist
router.delete('/:productId', removeFromWishlist);  // DELETE /api/wishlist/:productId

export default router;
