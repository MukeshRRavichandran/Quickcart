import Order from '../models/order.js';
import Cart from '../models/cart.js';
import Product from '../models/product.js';
import Coupon from '../models/coupon.js';
import { createNotification } from './notificationController.js';

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/orders  — Customer places an order
// ─────────────────────────────────────────────────────────────────────────────
export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, shippingMethod, paymentMethod, subtotal, shippingCost, tax, total, promoCode } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }

    // 1. Validate & consume promo code
    if (promoCode && promoCode.trim() !== '') {
      const coupon = await Coupon.findOne({ code: promoCode.toUpperCase().trim() });
      if (!coupon) return res.status(400).json({ message: 'Invalid promo code' });
      if (coupon.status !== 'Active') return res.status(400).json({ message: 'Promo code is no longer active' });
      coupon.usedCount += 1;
      coupon.usedBy.push({ user: req.user._id, usedAt: new Date() });
      await coupon.save();
    }

    // 2. Verify stock, deduct inventory, collect seller IDs
    const orderedItems = [];
    const sellersToNotify = new Set();

    for (const item of items) {
      const dbProduct = await Product.findById(item.product);
      if (!dbProduct) return res.status(404).json({ message: `Product not found: ${item.name || item.product}` });
      if (dbProduct.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for "${dbProduct.name}". Available: ${dbProduct.stock}` });
      }

      dbProduct.stock     -= item.quantity;
      dbProduct.soldCount  = (dbProduct.soldCount || 0) + item.quantity;
      await dbProduct.save();

      // Low-stock alert to seller
      if (dbProduct.stock <= 20 && dbProduct.seller) {
        await createNotification(
          dbProduct.seller,
          `⚠️ Stock alert: "${dbProduct.name}" is running low (${dbProduct.stock} left)`,
          'stock'
        );
      }

      if (dbProduct.seller) sellersToNotify.add(dbProduct.seller.toString());

      orderedItems.push({
        product:  item.product,
        name:     item.name     || dbProduct.name,
        price:    item.price    || dbProduct.price,
        quantity: item.quantity,
        image:    item.image    || dbProduct.image,
        seller:   dbProduct.seller || null,
      });
    }

    // 3. Create the Order document
    const order = await Order.create({
      user: req.user._id,
      items: orderedItems,
      shippingAddress,
      shippingMethod:  shippingMethod  || 'Standard Delivery',
      paymentMethod:   paymentMethod   || 'Card',
      subtotal:        Number(subtotal)   || 0,
      shippingCost:    Number(shippingCost) || 0,
      tax:             Number(tax)         || 0,
      total:           Number(total)       || 0,
      promoCode:       promoCode || '',
      status:          'Pending',
    });

    // 4. Clear the cart
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    // 5. Notifications
    await createNotification(req.user._id, `✅ Order #${order._id} placed successfully!`, 'order');
    for (const sellerId of sellersToNotify) {
      await createNotification(sellerId, `🛒 New order received (₹${Number(total).toFixed(2)}) from ${req.user.name}`, 'order');
    }

    return res.status(201).json(order);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/orders  — Customer's own orders
// ─────────────────────────────────────────────────────────────────────────────
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.json(orders);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/orders/:id  — Customer fetches a specific order
// ─────────────────────────────────────────────────────────────────────────────
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const isOwner  = order.user.toString() === req.user._id.toString();
    const isAdmin  = req.user.role === 'admin' || req.user.role === 'sub-admin';
    const isSeller = req.user.role === 'seller' &&
      order.items.some(i => i.seller && i.seller.toString() === req.user._id.toString());

    if (!isOwner && !isAdmin && !isSeller) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    return res.json(order);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/orders/:id/cancel  — Customer cancels their order
// ─────────────────────────────────────────────────────────────────────────────
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const isOwner = order.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin' || req.user.role === 'sub-admin';
    if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Not authorized to cancel this order' });

    if (['Cancelled', 'Refunded', 'Delivered'].includes(order.status)) {
      return res.status(400).json({ message: `Cannot cancel an order that is already ${order.status}` });
    }

    if (['Shipped'].includes(order.status) && !isAdmin) {
      return res.status(400).json({ message: 'Cannot cancel a shipped order. Contact support.' });
    }

    // Restore inventory
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
    }

    order.status = 'Cancelled';
    await order.save();

    await createNotification(order.user, `❌ Order #${order._id} has been cancelled.`, 'order');
    for (const item of order.items) {
      if (item.seller) {
        await createNotification(item.seller, `Order #${order._id} was cancelled. Stock restored.`, 'order');
      }
    }

    return res.json({ message: 'Order cancelled successfully', order });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/orders/seller  — Seller fetches orders containing their products
// ─────────────────────────────────────────────────────────────────────────────
export const getSellerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ 'items.seller': req.user._id })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    // Only expose items that belong to this seller
    const filtered = orders.map(o => {
      const obj = o.toObject();
      obj.items = obj.items.filter(i => i.seller && i.seller.toString() === req.user._id.toString());
      return obj;
    });

    return res.json(filtered);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/orders/seller/:id  — Seller updates status of an order
// ─────────────────────────────────────────────────────────────────────────────
export const updateSellerOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const hasItem = order.items.some(i => i.seller && i.seller.toString() === req.user._id.toString());
    if (!hasItem && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }

    const newStatus = req.body.status;
    if (!newStatus) return res.status(400).json({ message: 'status is required' });

    const oldStatus = order.status;
    order.status = newStatus;

    // Restore stock on cancellation
    if (['Cancelled', 'Refunded'].includes(newStatus) && !['Cancelled', 'Refunded'].includes(oldStatus)) {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
      }
    }

    await order.save();

    await createNotification(order.user, `📦 Order #${order._id} status updated to: ${newStatus}`, 'order');

    return res.json(order);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/orders/seller/earnings  — Seller earnings summary
// ─────────────────────────────────────────────────────────────────────────────
export const getSellerEarnings = async (req, res) => {
  try {
    const orders = await Order.find({
      'items.seller': req.user._id,
      status: { $nin: ['Cancelled', 'Refunded'] },
    });

    let totalEarnings = 0;
    const history = [];

    orders.forEach(order => {
      let orderTotal = 0;
      order.items.forEach(item => {
        if (item.seller && item.seller.toString() === req.user._id.toString()) {
          orderTotal += item.price * item.quantity;
        }
      });
      totalEarnings += orderTotal;
      if (orderTotal > 0) {
        history.push({
          id:     `TXN-${order._id.toString().slice(-6).toUpperCase()}`,
          date:   new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
          amount: orderTotal,
          status: order.status === 'Delivered' ? 'Settled' : 'Pending',
          type:   'Sale',
        });
      }
    });

    return res.json({
      balance:            parseFloat((totalEarnings * 0.15).toFixed(2)),
      pendingSettlement:  parseFloat((totalEarnings * 0.20).toFixed(2)),
      withdrawnTotal:     parseFloat((totalEarnings * 0.65).toFixed(2)),
      history:            history.slice(0, 20),
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
