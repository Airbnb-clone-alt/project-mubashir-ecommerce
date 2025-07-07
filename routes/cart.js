const express = require('express');
const router = express.Router();
const Product = require('../models/product');

// Show cart
router.get('/', (req, res) => {
  const cart = req.session.cart || [];
  res.render('cart/show', { cart });
});

// Add to cart
router.post('/add/:productId', async (req, res) => {
  const product = await Product.findById(req.params.productId);
  if (!product) {
    req.flash('error', 'Product not found');
    return res.redirect('/products');
  }
  if (!req.session.cart) req.session.cart = [];
  const cartItem = req.session.cart.find(item => item.product._id == product._id);
  if (cartItem) {
    cartItem.quantity += 1;
  } else {
    req.session.cart.push({ product, quantity: 1 });
  }
  req.flash('success', 'Added to cart');
  res.redirect('/cart');
});

// Update quantity
router.post('/update/:productId', (req, res) => {
  const { quantity } = req.body;
  const cart = req.session.cart || [];
  const item = cart.find(i => i.product._id == req.params.productId);
  if (item) item.quantity = parseInt(quantity);
  req.flash('success', 'Cart updated');
  res.redirect('/cart');
});

// Remove item
router.post('/remove/:productId', (req, res) => {
  req.session.cart = (req.session.cart || []).filter(i => i.product._id != req.params.productId);
  req.flash('success', 'Item removed');
  res.redirect('/cart');
});

module.exports = router;
