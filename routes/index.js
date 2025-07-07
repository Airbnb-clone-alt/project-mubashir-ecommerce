

const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

router.get('/', (req, res) => {
  res.render('home');  // EJS template render karega
});


// Register form
router.get('/register', (req, res) => {
  res.render('auth/register');
});

// Register logic
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash('success', 'Welcome to E-commerce App!');
      res.redirect('/products');
    });
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('/register');
  }
});

// Login form
router.get('/login', (req, res) => {
  res.render('auth/login');
});

// Login logic
router.post('/login', passport.authenticate('local', {
  failureFlash: true,
  failureRedirect: '/login'
}), (req, res) => {
  req.flash('success', 'Welcome back!');
  res.redirect('/products');
});

// Logout
router.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) {
      return next(err);
    }
    req.flash('success', 'Logged out successfully');
    res.redirect('/');
  });
});

module.exports = router;
