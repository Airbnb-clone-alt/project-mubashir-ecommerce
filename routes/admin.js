const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Category = require('../models/category');
const Order = require('../models/order');
const User = require('../models/user');

// ✅ Admin check middleware
function isAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.isAdmin) {
    return next();
  }
  req.flash('error', 'You must be admin');
  res.redirect('/');
}

// ✅ Admin dashboard
router.get('/dashboard', isAdmin, async (req, res) => {
  const productCount = await Product.countDocuments();
  const userCount = await User.countDocuments();
  const orderCount = await Order.countDocuments();
  res.render('admin/dashboard', { productCount, userCount, orderCount });
});

// ✅ Show all users
router.get('/users', isAdmin, async (req, res) => {
  const users = await User.find({});
  res.render('admin/userList', { users });
});

// ✅ Show all products
router.get('/products', isAdmin, async (req, res) => {
  const products = await Product.find().populate('category');
  res.render('admin/products', { products });
});

// ✅ Add product form
router.get('/products/new', isAdmin, async (req, res) => {
  const categories = await Category.find();
  res.render('admin/newProduct', { categories });
});

// ✅ Add product
router.post('/products', isAdmin, async (req, res) => {
  const { title, description, price, stock, category } = req.body;
  const product = new Product({ title, description, price, stock, category });
  await product.save();
  req.flash('success', 'Product added');
  res.redirect('/admin/products');
});

// ✅ Edit product form
router.get('/products/:id/edit', isAdmin, async (req, res) => {
  const product = await Product.findById(req.params.id);
  const categories = await Category.find();
  res.render('admin/editProduct', { product, categories });
});

// ✅ Update product
router.put('/products/:id', isAdmin, async (req, res) => {
  const { title, description, price, stock, category } = req.body;
  await Product.findByIdAndUpdate(req.params.id, { title, description, price, stock, category });
  req.flash('success', 'Product updated');
  res.redirect('/admin/products');
});

// ✅ Delete product
router.delete('/products/:id', isAdmin, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  req.flash('success', 'Product deleted');
  res.redirect('/admin/products');
});

module.exports = router;
