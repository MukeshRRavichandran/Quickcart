import User from '../models/user.js';
import Product from '../models/product.js';
import Order from '../models/order.js';
import RestockRequest from '../models/restockRequest.js';
import { createNotification } from './notificationController.js';

// GET /api/admin/users
export const getAdminUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// PUT /api/admin/users/:id/block
export const toggleUserBlock = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin') return res.status(400).json({ message: 'Cannot block a super admin' });

    user.isBlocked = !user.isBlocked;
    await user.save();
    return res.json({ message: `User ${user.isBlocked ? 'blocked' : 'unblocked'}`, user });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// PUT /api/admin/users/:id/approve  — Approve a seller
export const approveSeller = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role !== 'seller') return res.status(400).json({ message: 'User is not a seller' });

    user.isApproved = true;
    user.isBlocked  = false;
    await user.save();

    await createNotification(
      user._id,
      `🎉 Your store "${user.storeName || user.name}" has been approved!`,
      'payment'
    );

    return res.json({ message: 'Seller approved', user });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// PUT /api/admin/users/:id/reject  — Reject a seller
export const rejectSeller = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role !== 'seller') return res.status(400).json({ message: 'User is not a seller' });

    user.isApproved = false;
    user.isBlocked  = true;
    await user.save();
    return res.json({ message: 'Seller rejected', user });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// GET /api/admin/products
export const getAdminProducts = async (req, res) => {
  try {
    const products = await Product.find({})
      .populate('seller', 'name email storeName')
      .sort({ createdAt: -1 });
    return res.json(products);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// PUT /api/admin/products/:id/approve  { approvalStatus: 'approved'|'rejected'|'pending' }
export const approveProduct = async (req, res) => {
  try {
    const { approvalStatus } = req.body;
    if (!['approved', 'rejected', 'pending'].includes(approvalStatus)) {
      return res.status(400).json({ message: 'Invalid approvalStatus' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.approvalStatus = approvalStatus;
    await product.save();
    return res.json({ message: `Product ${approvalStatus}`, product });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// GET /api/admin/orders
export const getAdminOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    return res.json(orders);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// PUT /api/admin/orders/:id/courier  { courierPartner, status }
export const assignCourier = async (req, res) => {
  try {
    const { courierPartner, status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const oldStatus = order.status;
    const newStatus = status || order.status;

    if (courierPartner) order.courierPartner = courierPartner;
    order.status = newStatus;

    // Restore stock on cancellation
    if (['Cancelled', 'Refunded'].includes(newStatus) && !['Cancelled', 'Refunded'].includes(oldStatus)) {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
      }
    }

    await order.save();

    await createNotification(
      order.user,
      `📦 Order #${order._id} updated to "${newStatus}"${order.courierPartner ? `. Courier: ${order.courierPartner}` : ''}.`,
      'order'
    );

    return res.json({ message: 'Order updated', order });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// GET /api/admin/stats
export const getAdminDashboardStats = async (req, res) => {
  try {
    const [salesResult, totalUsers, totalProducts, pendingProducts, totalOrders] = await Promise.all([
      Order.aggregate([
        { $match: { status: { $nin: ['Cancelled', 'Refunded'] } } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      User.countDocuments({}),
      Product.countDocuments({}),
      Product.countDocuments({ approvalStatus: 'pending' }),
      Order.countDocuments({}),
    ]);

    const totalSales = salesResult.length > 0 ? salesResult[0].total : 0;

    return res.json({ totalSales, totalUsers, totalProducts, pendingProducts, totalOrders });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// GET /api/admin/restock-requests
export const getAdminRestockRequests = async (req, res) => {
  try {
    const requests = await RestockRequest.aggregate([
      {
        $group: {
          _id: '$product',
          count: { $sum: 1 },
          status: { $first: '$status' },
          lastRequestedAt: { $max: '$createdAt' }
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      { $unwind: '$productDetails' },
      {
        $lookup: {
          from: 'users',
          localField: 'productDetails.seller',
          foreignField: '_id',
          as: 'sellerDetails'
        }
      },
      {
        $unwind: {
          path: '$sellerDetails',
          preserveNullAndEmptyArrays: true
        }
      },
      { $sort: { count: -1 } }
    ]);

    return res.json(requests);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// GET /api/admin/restock-requests/:productId
export const getAdminRestockRequestsByProduct = async (req, res) => {
  try {
    const requests = await RestockRequest.find({ product: req.params.productId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    return res.json(requests);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
