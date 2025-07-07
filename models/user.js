const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  
  // Google ke liye fields
  googleId: { type: String, unique: true, sparse: true }, // sparse so local users without googleId are allowed
  displayName: String,
  photo: String,

  // Local + common fields
  username: { type: String, unique: true, sparse: true }, // username local ke liye zaruri, Google ke liye hum generate karenge
  wishlist: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }
  ],
  isAdmin: {
    type: Boolean,
    default: false
  }
});

// Add passport-local-mongoose plugin
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);

