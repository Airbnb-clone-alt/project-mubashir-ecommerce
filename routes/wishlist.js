const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const User = require('../models/user');
const { isLoggedIn } = require('../utils/middleware');

// Add to wishlist
router.post('/add/:id', isLoggedIn, async (req, res) => {
  const productId = req.params.id;
  const user = await User.findById(req.user._id);

  // Duplicate check
  if (user.wishlist.includes(productId)) {
    req.flash('info', 'Product already in wishlist!');
  } else {
    user.wishlist.push(productId);
    await user.save();
    req.flash('success', 'Added to wishlist!');
  }

  res.redirect('/products');
});

// Remove from wishlist
router.post('/remove/:id', isLoggedIn, async (req, res) => {
  const productId = req.params.id;
  await User.findByIdAndUpdate(req.user._id, { $pull: { wishlist: productId } });
  req.flash('success', 'Removed from wishlist!');
  res.redirect('/wishlist');
});

// Show wishlist
router.get('/', isLoggedIn, async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist');
  res.render('wishlist/show', { wishlist: user.wishlist });
});

module.exports = router;
