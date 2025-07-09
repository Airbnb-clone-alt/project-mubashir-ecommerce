const express = require('express');
const router = express.Router();
const Product = require('../models/product.js');
const Category = require('../models/category.js');
const { isLoggedIn, isProductOwnerOrAdmin } = require('../utils/middleware');

// Show product create form
router.get('/new', isLoggedIn, async (req, res) => {
  const categories = await Category.find();
  res.render('products/new', { categories });
});

// Create new product
router.post('/', isLoggedIn, async (req, res) => {
  try {
    const { title, description, price, image } = req.body; // ✅ direct req.body

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
    console.error(err); // ✅ log karo console me
    req.flash('error', 'Failed to create product');
    res.redirect('/products');
  }
});


// Show all products with optional category filter
router.get('/', async (req, res) => {
  try {
    const selectedCategory = req.query.category;
    let products;
    if (selectedCategory && selectedCategory !== 'All') {
      products = await Product.find({ category: selectedCategory });
    } else {
      products = await Product.find({});
    }

    const categories = await Category.find();
    res.render('products/index', { products, categories, selectedCategory });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Unable to fetch products');
    res.redirect('/');
  }
});

// Show edit form
router.get('/:id/edit', isLoggedIn, isProductOwnerOrAdmin, async (req, res) => {
  const product = res.locals.product;
  const categories = await Category.find();
  res.render('products/edit', { product, categories });
});

// Update product
router.put('/:id', isLoggedIn, isProductOwnerOrAdmin, async (req, res) => {
  const { title, description, price, image, category } = req.body;
  const product = res.locals.product;

  product.title = title;
  product.description = description;
  product.price = price;
  product.image = image;
  product.category = category;

  await product.save();
  req.flash('success', 'Product updated successfully!');
  res.redirect(`/products/${product._id}`);
});

// Show product detail
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

// Delete product
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

module.exports = router;
