const mongoose = require('mongoose');
const Coupon = require('./models/coupon'); // path ko apne structure ke hisaab se sahi kar lena

mongoose.connect('mongodb://127.0.0.1:27017/your-db-name') // apna DB name daalo
  .then(() => console.log('✅ DB connected'))
  .catch(err => console.error('❌ DB connection error:', err));

async function checkCoupons() {
  const coupons = await Coupon.find({});
  console.log("🎯 Coupons in DB:");
  console.log(coupons);
  mongoose.connection.close();
}

checkCoupons();
