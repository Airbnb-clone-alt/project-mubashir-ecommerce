const express = require('express');
const router = express.Router({ mergeParams: true });
const passport = require('passport');
const User = require('../models/user');
const { isLoggedIn } = require('../utils/middleware');

// =======================
// 🔑 Google OAuth Routes
// =======================

// Start Google login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Handle Google callback
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    req.flash('success', 'Logged in with Google!');
    res.redirect('/auth/profile');
  }
);

// Logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    req.flash('success', 'Logged out successfully!');
    res.redirect('/');
  });
});

// =======================
// 👤 Profile Routes
// =======================

// Profile view
router.get('/profile', isLoggedIn, (req, res) => {
  res.render('auth/profileView', { user: req.user });
});

// Change password form
router.get('/profile/change-password', isLoggedIn, (req, res) => {
  res.render('auth/changePassword');
});

// Handle change password
router.post('/profile/change-password', isLoggedIn, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  req.user.changePassword(currentPassword, newPassword, (err) => {
    if (err) {
      req.flash('error', 'Current password incorrect or other issue');
      return res.redirect('/auth/profile/change-password');
    }
    req.flash('success', 'Password changed successfully!');
    res.redirect('/auth/profile');
  });
});

// Forgot password form
router.get('/profile/forgot-password', (req, res) => {
  res.render('auth/forgot');
});

// Handle forgot password
router.post('/profile/forgot-password', async (req, res) => {
  const { email, newPassword } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    req.flash('error', 'No user found with this email');
    return res.redirect('/auth/profile/forgot-password');
  }

  user.setPassword(newPassword, async (err) => {
    if (err) {
      req.flash('error', 'Error setting new password');
      return res.redirect('/auth/profile/forgot-password');
    }
    await user.save();
    req.flash('success', 'Password reset successfully!');
    res.redirect('/login');
  });
});

module.exports = router;
