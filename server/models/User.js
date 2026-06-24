const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  anonymousName: {
    type: String,
    required: [true, 'Please provide an anonymous name'],
    unique: true,
    trim: true,
    maxlength: [30, 'Anonymous name cannot exceed 30 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Please provide a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false, // Do not return password by default in queries
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  avatar: {
    type: String,
    default: function () {
      // Generate a default avatar URL based on the anonymous name
      const encoded = encodeURIComponent(this.anonymousName);
      return `https://ui-avatars.com/api/?name=${encoded}&background=random&color=fff&size=200`;
    },
  },
  bookmarks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});



/**
 * Pre-save hook: Hash the password before saving if it has been modified.
 */
UserSchema.pre('save', async function (next) {
  // Only hash if password field has been modified
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/**
 * Instance method: Compare entered password with the hashed password in DB.
 * @param {string} enteredPassword - Plain text password to compare
 * @returns {Promise<boolean>} True if passwords match
 */
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * Instance method: Generate a signed JWT token for this user.
 * @returns {string} Signed JWT token
 */
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

module.exports = mongoose.model('User', UserSchema);
