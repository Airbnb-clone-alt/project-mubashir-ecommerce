const express = require('express');
const router = express.Router();
const Product = require('../models/product.js');
const { isLoggedIn, isProductOwnerOrAdmin } = require('../utils/middleware');

// Show product create form
router.get('/new', isLoggedIn, (req, res) => {
  res.render('products/new');
});

// Edit product form - only owner or admin
router.get('/:id/edit', isLoggedIn, isProductOwnerOrAdmin, (req, res) => {
  // product is already fetched and populated in middleware
  res.render('products/edit', { product: res.locals.product });
});

// Update product - only owner or admin
router.put('/:id', isLoggedIn, isProductOwnerOrAdmin, async (req, res) => {
  const { title, description, price, image } = req.body.product;
  const product = res.locals.product;

  product.title = title;
  product.description = description;
  product.price = price;
  product.image = image;

  await product.save();
  req.flash('success', 'Product updated successfully!');
  res.redirect(`/products/${product._id}`);
});

// Create new product
router.post('/', isLoggedIn, async (req, res) => {
  try {
    const { title, description, price, image } = req.body;
    const product = new Product({
      title,
      description,
      price,
      image,
      owner: req.user._id
    });
    await product.save();
    req.flash('success', 'Product created successfully!');
    res.redirect(`/products/${product._id}`);
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to create product');
    res.redirect('/products');
  }
});

// Show all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.render('products/index', { products });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Unable to fetch products');
    res.redirect('/');
  }
});

// Show product detail page with populated owner and reviews
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('owner')
      .populate({
        path: 'reviews',
        populate: { path: 'author' }
      });

    if (!product) {
      req.flash('error', 'Product not found');
      return res.redirect('/products');
    }

    res.render('products/show', { product });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong');
    res.redirect('/products');
  }
});

// Delete product - only owner or admin
router.delete('/:id', isLoggedIn, isProductOwnerOrAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    req.flash('success', 'Product deleted successfully!');
    res.redirect('/products');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to delete product');
    res.redirect('/products');
  }
});


// products route example
router.get('/products', async (req, res) => {
  const searchQuery = req.query.q;
  let products;
  if (searchQuery) {
    products = await Product.find({
      name: { $regex: searchQuery, $options: 'i' } // case insensitive search
    });
  } else {
    products = await Product.find({});
  }
  res.render('products', { products, q: searchQuery });
});


module.exports = router;
