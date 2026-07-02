import express from 'express';
import { validateCoupon, getActiveCoupons, getAdminCoupons, createCoupon, updateCoupon, deleteCoupon } from '../controllers/couponController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/validate', validateCoupon);    // POST /api/coupons/validate
router.get('/',          getActiveCoupons);  // GET  /api/coupons

// Admin-only
router.get('/admin',         admin, getAdminCoupons);
router.post('/admin',        admin, createCoupon);
router.put('/admin/:id',     admin, updateCoupon);
router.delete('/admin/:id',  admin, deleteCoupon);

export default router;
