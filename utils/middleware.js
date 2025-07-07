const Product = require('../models/product');
const Order = require('../models/order');
const Review = require('../models/Review');

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash('error', 'You must be signed in First!');
    return res.redirect('/login');
  }
  next();
};

module.exports.isProductOwnerOrAdmin = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('owner');
    if (!product) {
      req.flash('error', 'Product not found');
      return res.redirect('/products');
    }
    if (
      req.user &&
      ((product.owner && product.owner.equals(req.user._id)) || req.user.isAdmin)
    ) {
      res.locals.product = product; // reuse in routes
      return next();
    }
    req.flash('error', 'You do not have permission');
    return res.redirect(`/products/${req.params.id}`);
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong');
    return res.redirect('/products');
  }
};

module.exports.isOrderOwnerOrAdmin = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      req.flash('error', 'Order not found');
      return res.redirect('/orders');
    }
    if (
      req.user &&
      ((order.user && order.user.equals(req.user._id)) || req.user.isAdmin)
    ) {
      return next();
    }
    req.flash('error', 'You do not have permission');
    res.redirect('/orders');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong');
    res.redirect('/orders');
  }
};

module.exports.isReviewOwnerOrAdmin = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) {
      req.flash('error', 'Review not found');
      return res.redirect(`/products/${req.params.productId}`);
    }
    if (
      req.user &&
      ((review.author && review.author.equals(req.user._id)) || req.user.isAdmin)
    ) {
      return next();
    }
    req.flash('error', 'You do not have permission');
    return res.redirect(`/products/${req.params.productId}`);
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong');
    return res.redirect(`/products/${req.params.productId}`);
  }
};
