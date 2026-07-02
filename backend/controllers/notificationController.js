import Notification from '../models/notification.js';

// Internal helper — called from other controllers
export const createNotification = async (userId, text, type) => {
  try {
    return await Notification.create({ user: userId || null, text, type });
  } catch (err) {
    console.error('Notification creation failed:', err.message);
  }
};

// GET /api/notifications
export const getNotifications = async (req, res) => {
  try {
    const query = ['admin', 'sub-admin'].includes(req.user.role)
      ? { $or: [{ user: req.user._id }, { user: null }] }
      : { user: req.user._id };

    const notifications = await Notification.find(query).sort({ createdAt: -1 }).limit(50);
    return res.json(notifications);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// PUT /api/notifications/:id/read
export const markAsRead = async (req, res) => {
  try {
    const n = await Notification.findById(req.params.id);
    if (!n) return res.status(404).json({ message: 'Notification not found' });
    n.read = true;
    await n.save();
    return res.json(n);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// PUT /api/notifications/read-all
export const markAllRead = async (req, res) => {
  try {
    const query = ['admin', 'sub-admin'].includes(req.user.role)
      ? { $or: [{ user: req.user._id }, { user: null }], read: false }
      : { user: req.user._id, read: false };

    await Notification.updateMany(query, { $set: { read: true } });
    return res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
