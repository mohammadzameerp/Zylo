const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = asyncHandler(async (req, res, next) => {
  const { anonymousName, email, password } = req.body;

  // Check if user already exists with this email
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorResponse('An account with this email already exists', 400));
  }

  // Check if anonymous name is taken
  const existingName = await User.findOne({ anonymousName });
  if (existingName) {
    return next(new ErrorResponse('This anonymous name is already taken', 400));
  }

  // Create user
  const user = await User.create({
    anonymousName,
    email,
    password,
  });

  // Generate token
  const token = user.getSignedJwtToken();

  res.status(201).json({
    success: true,
    token,
    user: {
      id: user._id,
      _id: user._id,
      anonymousName: user.anonymousName,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      bookmarks: user.bookmarks || [],
    },
  });
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Find user by email and explicitly select the password field
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Generate token
  const token = user.getSignedJwtToken();

  res.status(200).json({
    success: true,
    token,
    user: {
      id: user._id,
      _id: user._id,
      anonymousName: user.anonymousName,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      bookmarks: user.bookmarks || [],
    },
  });
});

/**
 * @desc    Logout user (client-side token removal)
 * @route   POST /api/auth/logout
 * @access  Public
 */
const logout = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
    data: {},
  });
});

/**
 * @desc    Get current logged-in user
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

module.exports = { register, login, logout, getMe };
