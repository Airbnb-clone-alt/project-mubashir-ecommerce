const express = require('express');
const router = express.Router({ mergeParams: true });
const Product = require('../models/product');
const Review = require('../models/Review');
const { isLoggedIn, isReviewOwnerOrAdmin } = require('../utils/middleware');

// Add a review
router.post('/', isLoggedIn, async (req, res) => {
  const { rating, comment } = req.body;
  const { productId } = req.params;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      req.flash('error', 'Product not found');
      return res.redirect('/products');
    }

    const review = new Review({
      comment,
      rating,
      author: req.user._id
    });

    await review.save();
    product.reviews.push(review._id);
    await product.save();

    req.flash('success', 'Review added successfully!');
    res.redirect(`/products/${productId}`);
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong while adding review');
    res.redirect('/products');
  }
});

// Delete a review
router.post('/:reviewId/delete', isLoggedIn, isReviewOwnerOrAdmin, async (req, res) => {
  const { productId, reviewId } = req.params;

  try {
    await Product.findByIdAndUpdate(productId, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    req.flash('success', 'Review deleted successfully!');
    res.redirect(`/products/${productId}`);
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong while deleting review');
    res.redirect(`/products/${productId}`);
  }
});

module.exports = router;
