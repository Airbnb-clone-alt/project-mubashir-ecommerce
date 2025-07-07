const Coupon = require('../models/coupon');

async function applyCoupon(code, userId, cartTotal) {
  const coupon = await Coupon.findOne({
    code: { $regex: new RegExp(`^${code}$`, 'i') }
  });

  if (!coupon) return { success: false, message: 'Invalid code' };

  const now = new Date();
  if (now < coupon.validFrom || now > coupon.validTill) {
    return { success: false, message: 'Coupon expired or not active' };
  }

  if (cartTotal < coupon.minOrderAmount) {
    return { success: false, message: `Min order ₹${coupon.minOrderAmount} required` };
  }

  const usage = coupon.usedBy.find(u => u.userId.toString() === userId.toString());
  if (usage && usage.usedCount >= coupon.usageLimit) {
    return { success: false, message: 'Usage limit reached' };
  }

  let discount = 0;
  if (coupon.discountType === 'percentage') {
    discount = (cartTotal * coupon.discountValue) / 100;
    if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
  } else {
    discount = coupon.discountValue;
  }

  discount = Math.round(discount);

  return { success: true, discount, couponId: coupon._id, code: coupon.code };
}

module.exports = applyCoupon;
