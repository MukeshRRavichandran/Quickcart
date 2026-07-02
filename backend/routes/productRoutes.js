import express from 'express';
import {
  getProducts,
  getSellerProducts,
  getProductById,
  createSellerProduct,
  updateSellerProduct,
  deleteSellerProduct,
} from '../controllers/productController.js';
import { protect, seller } from '../middleware/auth.js';

const router = express.Router();

// ⚠️  IMPORTANT: specific paths MUST come before /:id
router.get('/seller',    protect, seller, getSellerProducts);   // GET /api/products/seller
router.get('/',          getProducts);                           // GET /api/products
router.post('/',         protect, seller, createSellerProduct); // POST /api/products
router.put('/:id',       protect, seller, updateSellerProduct); // PUT  /api/products/:id
router.delete('/:id',    protect, seller, deleteSellerProduct); // DELETE /api/products/:id
router.get('/:id',       getProductById);                       // GET /api/products/:id

export default router;
