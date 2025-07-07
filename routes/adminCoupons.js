const express = require('express');
const router = express.Router();
const Coupon = require('../models/coupon');

// List coupons
router.get('/coupons', async (req, res) => {
  const coupons = await Coupon.find({});
  res.render('admin/coupons/index', { coupons });
});

// New coupon form
router.get('/coupons/new', (req, res) => {
  res.render('admin/coupons/new');
});

// Create coupon
router.post('/coupons', async (req, res) => {
  const coupon = new Coupon(req.body);
  await coupon.save();
  res.redirect('/admin/coupons');
});

// Edit form
router.get('/coupons/:id/edit', async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  res.render('admin/coupons/edit', { coupon });
});

// Update coupon
router.post('/coupons/:id', async (req, res) => {
  await Coupon.findByIdAndUpdate(req.params.id, req.body);
  res.redirect('/admin/coupons');
});

// Delete coupon
router.post('/coupons/:id/delete', async (req, res) => {
  await Coupon.findByIdAndDelete(req.params.id);
  res.redirect('/admin/coupons');
});

module.exports = router;
