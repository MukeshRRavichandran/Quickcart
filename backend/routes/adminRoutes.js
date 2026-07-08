import express from 'express';
import {
  getAdminUsers,
  toggleUserBlock,
  approveSeller,
  rejectSeller,
  getAdminProducts,
  approveProduct,
  getAdminOrders,
  assignCourier,
  getAdminDashboardStats,
  getAdminRestockRequests,
  getAdminRestockRequestsByProduct,
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require authentication + admin role
router.use(protect);
router.use(admin);

router.get('/stats',                  getAdminDashboardStats); // GET  /api/admin/stats
router.get('/users',                  getAdminUsers);          // GET  /api/admin/users
router.put('/users/:id/block',        toggleUserBlock);         // PUT  /api/admin/users/:id/block
router.put('/users/:id/approve',      approveSeller);           // PUT  /api/admin/users/:id/approve
router.put('/users/:id/reject',       rejectSeller);            // PUT  /api/admin/users/:id/reject
router.get('/products',               getAdminProducts);        // GET  /api/admin/products
router.put('/products/:id/approve',   approveProduct);          // PUT  /api/admin/products/:id/approve
router.get('/orders',                 getAdminOrders);          // GET  /api/admin/orders
router.put('/orders/:id/courier',     assignCourier);           // PUT  /api/admin/orders/:id/courier
router.get('/restock-requests',       getAdminRestockRequests); // GET /api/admin/restock-requests
router.get('/restock-requests/:productId', getAdminRestockRequestsByProduct); // GET /api/admin/restock-requests/:productId

export default router;
