const mongoose = require('mongoose');
const Coupon = require('../models/coupon');

mongoose.connect('mongodb://127.0.0.1:27017/your-db-name') // <-- yaha apna DB name daalo
  .then(() => console.log('✅ DB connected'))
  .catch(err => console.error('❌ DB connection error:', err));

async function seedCoupons() {
  await Coupon.deleteMany({});
  await Coupon.insertMany([
    {
      code: "CODERMUBASHIR",
      discountType: "flat",
      discountValue: 1000,
      validFrom: new Date("2024-07-01"),
      validTill: new Date("2025-12-31"),
      minOrderAmount: 5000,
      usageLimit: 1,
      usedBy: []
    },
    {
      code: "WELCOME2011",
      discountType: "percentage",
      discountValue: 10,
      maxDiscount: 2000,
      validFrom: new Date("2024-07-01"),
      validTill: new Date("2025-12-31"),
      minOrderAmount: 5000,
      usageLimit: 1,
      usedBy: []
    },
    {
      code: "CODERMUBASHIR2011",
      discountType: "flat",
      discountValue: 1500,
      validFrom: new Date("2024-07-01"),
      validTill: new Date("2025-12-31"),
      minOrderAmount: 5000,
      usageLimit: 1,
      usedBy: []
    }
  ]);
  console.log("🎉 Coupons seeded successfully!");
  mongoose.connection.close();
}

seedCoupons();
