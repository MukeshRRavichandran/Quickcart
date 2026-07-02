import express from 'express';
import { getNotifications, markAsRead, markAllRead } from '../controllers/notificationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

// ⚠️  /read-all must come before /:id
router.get('/',             getNotifications);  // GET /api/notifications
router.put('/read-all',     markAllRead);        // PUT /api/notifications/read-all
router.put('/:id/read',     markAsRead);         // PUT /api/notifications/:id/read

export default router;
