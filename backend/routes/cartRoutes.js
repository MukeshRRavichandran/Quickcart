import express from 'express';
import { getCart, addToCart, updateCartItem, removeCartItem } from '../controllers/cartController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);                    // all cart routes require login

router.get('/',          getCart);      // GET    /api/cart
router.post('/',         addToCart);    // POST   /api/cart
router.put('/:productId',  updateCartItem);  // PUT  /api/cart/:productId
router.delete('/:productId', removeCartItem); // DELETE /api/cart/:productId

export default router;
