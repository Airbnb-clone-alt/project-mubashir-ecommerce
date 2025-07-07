const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const Product = require('../models/product');
const Coupon = require('../models/coupon');
const { isLoggedIn, isOrderOwnerOrAdmin } = require('../utils/middleware');
const applyCoupon = require('../utils/applyCoupon');

// Show checkout page
router.post('/buy/:id', isLoggedIn, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      req.flash('error', 'Product not found');
      return res.redirect('/products');
    }
    res.render('orders/checkout', { product });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong');
    res.redirect('/products');
  }
});

// Apply coupon via AJAX
router.post('/apply-coupon', isLoggedIn, async (req, res) => {
  try {
    console.log("Apply coupon req body:", req.body);  // DEBUG
    const { code, cartTotal } = req.body;

    if (!code || !cartTotal) {
      return res.json({ success: false, message: 'Code or total missing' });
    }

    const result = await applyCoupon(code, req.user._id, cartTotal);

    if (!result.success) {
      return res.json({ success: false, message: result.message });
    }

    res.json({
      success: true,
      discount: result.discount,
      code: result.code,
      message: `Discount ₹${result.discount} applied`
    });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: 'Server error while applying coupon' });
  }
});

// Confirm order
router.post('/confirm', isLoggedIn, async (req, res) => {
  try {
    console.log("Confirm order req body:", req.body);  // DEBUG
    const { productId, couponCode } = req.body;
    const product = await Product.findById(productId);

    if (!product) {
      req.flash('error', 'Product not found');
      return res.redirect('/products');
    }

    let discount = 0;
    if (couponCode) {
      const result = await applyCoupon(couponCode, req.user._id, product.price);
      if (!result.success) {
        req.flash('error', result.message);
        return res.redirect(`/products/${productId}`);
      }

      discount = result.discount;

      // Update coupon usage
      await Coupon.findByIdAndUpdate(result.couponId, {
        $push: { usedBy: { userId: req.user._id, usedCount: 1 } }
      });
    }

    const order = new Order({
      user: req.user._id,
      product: product._id,
      quantity: 1,
      totalPrice: product.price,
      discount: discount,
      finalAmount: product.price - discount
    });

    await order.save();
    req.flash('success', 'Order placed successfully!');
    res.redirect('/orders');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong while placing order');
    res.redirect('/products');
  }
});

// List orders
router.get('/', isLoggedIn, async (req, res) => {
  try {
    let orders;
    if (req.user.isAdmin) {
      orders = await Order.find({}).populate('product user');
    } else {
      orders = await Order.find({ user: req.user._id }).populate('product');
    }
    res.render('orders/index', { orders });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong while fetching orders');
    res.redirect('/products');
  }
});

// Cancel order
router.delete('/:id', isLoggedIn, isOrderOwnerOrAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    req.flash('success', 'Order cancelled successfully!');
    res.redirect('/orders');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong while cancelling order');
    res.redirect('/orders');
  }
});

module.exports = router;
