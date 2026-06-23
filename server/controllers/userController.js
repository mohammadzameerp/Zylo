const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');

/**
 * @desc    Get current user's profile
 * @route   GET /api/users/profile
 * @access  Private
 */
const getProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).lean();

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  // Gather profile stats
  const postsCount = await Post.countDocuments({ author: user._id });
  const posts = await Post.find({ author: user._id }).select('likes').lean();
  const likesReceived = posts.reduce((sum, post) => sum + (post.likes ? post.likes.length : 0), 0);
  const commentsReceived = await Comment.countDocuments({
    post: { $in: posts.map((p) => p._id) },
  });

  res.status(200).json({
    success: true,
    data: {
      ...user,
      stats: {
        postsCount,
        likesReceived,
        commentsReceived,
        bookmarksCount: user.bookmarks ? user.bookmarks.length : 0,
      },
    },
  });
});

/**
 * @desc    Update current user's profile (anonymousName)
 * @route   PUT /api/users/profile
 * @access  Private
 */
const updateProfile = asyncHandler(async (req, res, next) => {
  const { anonymousName } = req.body;

  if (!anonymousName) {
    return next(new ErrorResponse('Please provide an anonymous name', 400));
  }

  if (anonymousName.length < 3 || anonymousName.length > 30) {
    return next(
      new ErrorResponse('Anonymous name must be between 3 and 30 characters', 400)
    );
  }

  // Check if the new name is already taken by another user
  const existingUser = await User.findOne({
    anonymousName,
    _id: { $ne: req.user._id },
  });

  if (existingUser) {
    return next(new ErrorResponse('This anonymous name is already taken', 400));
  }

  // Update user profile
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      anonymousName,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        anonymousName
      )}&background=random&color=fff&size=200`,
    },
    {
      new: true,
      runValidators: true,
    }
  ).lean();

  res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 * @desc    Get current user's bookmarked posts
 * @route   GET /api/users/bookmarks
 * @access  Private
 */
const getBookmarks = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id)
    .populate({
      path: 'bookmarks',
      populate: {
        path: 'author',
        select: 'anonymousName avatar',
      },
    })
    .lean();

  res.status(200).json({
    success: true,
    count: user.bookmarks ? user.bookmarks.length : 0,
    data: user.bookmarks || [],
  });
});

/**
 * @desc    Get current user's statistics
 * @route   GET /api/users/stats
 * @access  Private
 */
const getUserStats = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  // Count posts by this user
  const postsCount = await Post.countDocuments({ author: userId });

  // Calculate total likes received across all user's posts
  const userPosts = await Post.find({ author: userId }).select('likes').lean();
  const likesReceived = userPosts.reduce(
    (sum, post) => sum + (post.likes ? post.likes.length : 0),
    0
  );

  // Count comments received on this user's posts
  const postIds = userPosts.map((p) => p._id);
  const commentsReceived = await Comment.countDocuments({
    post: { $in: postIds },
  });

  // Count bookmarks
  const user = await User.findById(userId).select('bookmarks').lean();
  const bookmarksCount = user.bookmarks ? user.bookmarks.length : 0;

  res.status(200).json({
    success: true,
    data: {
      postsCount,
      likesReceived,
      commentsReceived,
      bookmarksCount,
    },
  });
});

module.exports = { getProfile, updateProfile, getBookmarks, getUserStats };
