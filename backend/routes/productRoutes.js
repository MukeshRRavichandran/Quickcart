import express from 'express';
import {
  getProducts,
  getSellerProducts,
  getProductById,
  createSellerProduct,
  updateSellerProduct,
  deleteSellerProduct,
  requestRestockNotification,
  getSellerRestockRequests,
} from '../controllers/productController.js';
import { protect, seller, optionalProtect } from '../middleware/auth.js';

const router = express.Router();

// ⚠️  IMPORTANT: specific paths MUST come before /:id
router.get('/seller/restock-requests', protect, seller, getSellerRestockRequests); // GET /api/products/seller/restock-requests
router.get('/seller',    protect, seller, getSellerProducts);   // GET /api/products/seller
router.get('/',          getProducts);                           // GET /api/products
router.post('/',         protect, seller, createSellerProduct); // POST /api/products
router.put('/:id',       protect, seller, updateSellerProduct); // PUT  /api/products/:id
router.delete('/:id',    protect, seller, deleteSellerProduct); // DELETE /api/products/:id
router.post('/:id/notify', optionalProtect, requestRestockNotification); // POST /api/products/:id/notify
router.get('/:id',       getProductById);                       // GET /api/products/:id

export default router;
