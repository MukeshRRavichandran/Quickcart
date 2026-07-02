import express from 'express';
import { getCategories, getAdminCategories, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getCategories);                              // public

// Admin-only
router.get('/admin',       protect, admin, getAdminCategories);
router.post('/admin',      protect, admin, createCategory);
router.put('/admin/:id',   protect, admin, updateCategory);
router.delete('/admin/:id',protect, admin, deleteCategory);

export default router;
