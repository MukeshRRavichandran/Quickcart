import Coupon from '../models/coupon.js';

// Internal validation helper (exported so orderController can use it)
export const validateCouponHelper = (coupon, user, subtotal) => {
  const now = new Date();

  if (coupon.status !== 'Active')
    return { valid: false, message: 'Coupon is inactive' };

  if (coupon.validFrom && now < new Date(coupon.validFrom))
    return { valid: false, message: 'Coupon is not yet active' };

  if (coupon.validUntil && now > new Date(coupon.validUntil))
    return { valid: false, message: 'Coupon has expired' };

  if (coupon.validDays && coupon.validDays.length > 0) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    if (!coupon.validDays.includes(days[now.getDay()]))
      return { valid: false, message: `Coupon is only valid on: ${coupon.validDays.join(', ')}` };
  }

  if (coupon.usageLimit != null && coupon.usedCount >= coupon.usageLimit)
    return { valid: false, message: 'Coupon usage limit reached' };

  if (subtotal < coupon.minOrderValue)
    return { valid: false, message: `Minimum order of ₹${coupon.minOrderValue} required` };

  if (user) {
    const userUsage = coupon.usedBy.filter(u => u.user.toString() === user._id.toString()).length;
    if (coupon.userLimit != null && userUsage >= coupon.userLimit)
      return { valid: false, message: 'You have already used this coupon' };
  }

  let discountAmount = coupon.type === 'Percentage'
    ? (subtotal * coupon.value) / 100
    : coupon.value;

  if (coupon.maxDiscount != null && discountAmount > coupon.maxDiscount)
    discountAmount = coupon.maxDiscount;

  if (discountAmount > subtotal) discountAmount = subtotal;

  return { valid: true, discountAmount: parseFloat(discountAmount.toFixed(2)) };
};

// POST /api/coupons/validate  { code, subtotal }
export const validateCoupon = async (req, res) => {
  try {
    const { code, subtotal } = req.body;
    if (!code) return res.status(400).json({ message: 'Promo code is required' });

    const coupon = await Coupon.findOne({ code: code.toUpperCase().trim() });
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });

    const result = validateCouponHelper(coupon, req.user, Number(subtotal) || 0);
    if (!result.valid) return res.status(400).json({ message: result.message });

    return res.json({
      valid:          true,
      code:           coupon.code,
      discountAmount: result.discountAmount,
      type:           coupon.type,
      value:          coupon.value,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// GET /api/coupons  — Active coupons visible to customer
export const getActiveCoupons = async (req, res) => {
  try {
    const now = new Date();
    const coupons = await Coupon.find({ status: 'Active' });

    const eligible = coupons.filter(c => {
      if (c.validFrom && now < new Date(c.validFrom)) return false;
      if (c.validUntil && now > new Date(c.validUntil)) return false;
      if (c.usageLimit != null && c.usedCount >= c.usageLimit) return false;
      if (req.user) {
        const userUsage = c.usedBy.filter(u => u.user.toString() === req.user._id.toString()).length;
        if (c.userLimit != null && userUsage >= c.userLimit) return false;
      }
      return true;
    });

    return res.json(eligible);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ── Admin Coupon CRUD ─────────────────────────────────────────────────────────

// GET /api/coupons/admin
export const getAdminCoupons = async (req, res) => {
  try {
    return res.json(await Coupon.find({}).sort({ createdAt: -1 }));
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// POST /api/coupons/admin
export const createCoupon = async (req, res) => {
  try {
    const { code, name, type, value, minOrderValue, validFrom, validUntil, validDays, usageLimit, userLimit, maxDiscount, status } = req.body;

    const exists = await Coupon.findOne({ code: code.toUpperCase().trim() });
    if (exists) return res.status(400).json({ message: 'Coupon code already exists' });

    const coupon = await Coupon.create({
      code:          code.toUpperCase().trim(),
      name,
      type,
      value:         Number(value),
      minOrderValue: Number(minOrderValue) || 0,
      maxDiscount:   maxDiscount != null ? Number(maxDiscount) : null,
      validFrom:     validFrom || null,
      validUntil:    validUntil || null,
      validDays:     validDays || [],
      usageLimit:    usageLimit != null ? Number(usageLimit) : null,
      userLimit:     userLimit  != null ? Number(userLimit)  : 1,
      status:        status || 'Active',
    });

    return res.status(201).json(coupon);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// PUT /api/coupons/admin/:id
export const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });

    const fields = ['name', 'type', 'value', 'minOrderValue', 'maxDiscount', 'validFrom', 'validUntil', 'validDays', 'usageLimit', 'userLimit', 'status'];
    fields.forEach(f => { if (req.body[f] !== undefined) coupon[f] = req.body[f]; });

    return res.json(await coupon.save());
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// DELETE /api/coupons/admin/:id
export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    await coupon.deleteOne();
    return res.json({ message: 'Coupon deleted' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
