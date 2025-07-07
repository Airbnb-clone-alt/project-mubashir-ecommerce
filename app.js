if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const express = require('express');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/user');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

const app = express();

// DB Connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('✅ DB connected'))
  .catch(err => console.log('❌ DB error', err));

// View engine
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(express.json());

const store = MongoStore.create({
  mongoUrl: process.env.MONGO_URL,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});


// Session
const sessionConfig = {
   secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 1 week from now
    maxAge: 7 * 24 * 60 * 60 * 1000,               // 1 week in milliseconds
    httpOnly: true,                                // can't access cookie via client-side JS
  },
};
app.use(session(sessionConfig));
app.use(flash());

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Local strategy
passport.use(new LocalStrategy(User.authenticate()));

// Google strategy
passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
 callbackURL: "https://project-mubashir-ecommerce.onrender.com/auth/google/callback"
},
async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      // Auto-generate username
      const autoUsername = profile.displayName.replace(/\s+/g, '').toLowerCase() + Date.now();
      
      user = await User.create({
        googleId: profile.id,
        email: profile.emails[0].value,
        displayName: profile.displayName,
        photo: profile.photos[0].value,
        username: autoUsername
      });
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

// Serialize / Deserialize
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Flash + currentUser
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// Routes
const userRoutes = require('./routes/user');
const indexRoutes = require('./routes/index');
const productRoutes = require('./routes/products');
const adminRoutes = require('./routes/admin');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const wishlistRoutes = require('./routes/wishlist');
const reviewRoutes = require('./routes/reviews');
const adminCouponsRoutes = require('./routes/adminCoupons');

app.use('/auth', userRoutes);
app.use('/', indexRoutes);
app.use('/products', productRoutes);
app.use('/admin', adminRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);
app.use('/wishlist', wishlistRoutes);
app.use('/products/:productId/reviews', reviewRoutes);
app.use('/admin', adminCouponsRoutes);



// Home
app.get('/', (req, res) => {
  res.render('home');
});

// 404
app.use((req, res) => {
  res.status(404).render('404');
});




// Server
app.listen(3000, () => {
  console.log('🚀 Server running on http://localhost:3000');
});
