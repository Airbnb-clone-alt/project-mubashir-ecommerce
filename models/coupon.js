const mongoose = require('mongoose');
const couponSchema = new mongoose.Schema({
  code: String,
  discountType: String, // 'flat' or 'percentage'
  discountValue: Number,
  minOrderAmount: Number,
  maxDiscount: Number,
  usageLimit: Number,
  validFrom: Date,
  validTill: Date,
  usedBy: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      usedCount: { type: Number, default: 0 }
    }
  ]
});
module.exports = mongoose.model('Coupon', couponSchema);
