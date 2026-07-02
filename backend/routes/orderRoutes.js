import express from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  cancelOrder,
  getSellerOrders,
  updateSellerOrderStatus,
  getSellerEarnings,
} from '../controllers/orderController.js';
import { protect, seller } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);   // all order routes require authentication

// ⚠️  IMPORTANT: static paths MUST come before /:id to avoid route conflicts
router.get('/seller/earnings', seller, getSellerEarnings);        // GET  /api/orders/seller/earnings
router.get('/seller',          seller, getSellerOrders);          // GET  /api/orders/seller
router.put('/seller/:id',      seller, updateSellerOrderStatus);  // PUT  /api/orders/seller/:id

router.post('/',          createOrder);     // POST /api/orders
router.get('/',           getOrders);       // GET  /api/orders
router.get('/:id',        getOrderById);    // GET  /api/orders/:id
router.put('/:id/cancel', cancelOrder);     // PUT  /api/orders/:id/cancel

export default router;
