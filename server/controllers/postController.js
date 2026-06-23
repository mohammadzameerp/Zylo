const fs = require('fs');
const path = require('path');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Notification = require('../models/Notification');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');

/**
 * @desc    Get all posts with filtering, sorting, pagination, and search
 * @route   GET /api/posts
 * @access  Public
 */
const getPosts = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  // Build query filter
  const filter = {};

  // Author filter
  if (req.query.author) {
    filter.author = req.query.author;
  }

  // Category filter
  if (req.query.category) {
    filter.category = req.query.category;
  }

  // Tag filter
  if (req.query.tag) {
    filter.tags = { $in: [req.query.tag.toLowerCase()] };
  }

  // Search filter (regex on content)
  if (req.query.search) {
    filter.content = {
      $regex: req.query.search,
      $options: 'i', // case-insensitive
    };
  }

  // Determine sort order
  let sortOption = { createdAt: -1 }; // default: latest first
  if (req.query.sort === 'trending') {
    sortOption = { likesCount: -1, createdAt: -1 };
  }

  // Execute query
  const total = await Post.countDocuments(filter);
  const posts = await Post.find(filter)
    .populate('author', 'anonymousName avatar')
    .sort(sortOption)
    .skip(skip)
    .limit(limit)
    .lean();

  const pages = Math.ceil(total / limit);

  res.status(200).json({
    success: true,
    count: posts.length,
    pagination: {
      page,
      limit,
      total,
      pages,
    },
    data: posts,
  });
});

/**
 * @desc    Get a single post by ID with populated author and comments
 * @route   GET /api/posts/:id
 * @access  Public
 */
const getPost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id)
    .populate('author', 'anonymousName avatar')
    .lean();

  if (!post) {
    return next(new ErrorResponse(`Post not found with id of ${req.params.id}`, 404));
  }

  // Fetch comments for this post, populated with author info
  const comments = await Comment.find({ post: post._id })
    .populate('author', 'anonymousName avatar')
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({
    success: true,
    data: {
      ...post,
      comments,
    },
  });
});

/**
 * @desc    Create a new post
 * @route   POST /api/posts
 * @access  Private
 */
const createPost = asyncHandler(async (req, res, next) => {
  const { content, category, tags } = req.body;

  const postData = {
    content,
    author: req.user._id,
  };

  // Optional fields
  if (category) {
    postData.category = category;
  }

  if (tags) {
    // Accept tags as comma-separated string or array
    postData.tags = Array.isArray(tags)
      ? tags.map((t) => t.trim().toLowerCase())
      : tags.split(',').map((t) => t.trim().toLowerCase());
  }

  // Handle uploaded image
  if (req.file) {
    postData.image = `/uploads/${req.file.filename}`;
  }

  let post = await Post.create(postData);

  // Populate author for the response
  post = await Post.findById(post._id)
    .populate('author', 'anonymousName avatar')
    .lean();

  res.status(201).json({
    success: true,
    data: post,
  });
});

/**
 * @desc    Update a post
 * @route   PUT /api/posts/:id
 * @access  Private (owner or admin)
 */
const updatePost = asyncHandler(async (req, res, next) => {
  let post = await Post.findById(req.params.id);

  if (!post) {
    return next(new ErrorResponse(`Post not found with id of ${req.params.id}`, 404));
  }

  // Check ownership: only the author or an admin can update
  if (
    post.author.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    return next(new ErrorResponse('Not authorized to update this post', 403));
  }

  // Build update fields
  const updateFields = {};

  if (req.body.content !== undefined) {
    updateFields.content = req.body.content;
  }

  if (req.body.category !== undefined) {
    updateFields.category = req.body.category;
  }

  if (req.body.tags !== undefined) {
    updateFields.tags = Array.isArray(req.body.tags)
      ? req.body.tags.map((t) => t.trim().toLowerCase())
      : req.body.tags.split(',').map((t) => t.trim().toLowerCase());
  }

  post = await Post.findByIdAndUpdate(req.params.id, updateFields, {
    new: true,
    runValidators: true,
  })
    .populate('author', 'anonymousName avatar')
    .lean();

  res.status(200).json({
    success: true,
    data: post,
  });
});

/**
 * @desc    Delete a post
 * @route   DELETE /api/posts/:id
 * @access  Private (owner or admin)
 */
const deletePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new ErrorResponse(`Post not found with id of ${req.params.id}`, 404));
  }

  // Check ownership: only the author or an admin can delete
  if (
    post.author.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    return next(new ErrorResponse('Not authorized to delete this post', 403));
  }

  // Delete the associated image file if it exists
  if (post.image) {
    const imagePath = path.join(__dirname, '..', post.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }

  // Delete all comments associated with this post
  await Comment.deleteMany({ post: post._id });

  // Delete all notifications associated with this post
  await Notification.deleteMany({ post: post._id });

  // Remove post from all users' bookmarks
  await User.updateMany(
    { bookmarks: post._id },
    { $pull: { bookmarks: post._id } }
  );

  // Delete the post
  await Post.findByIdAndDelete(post._id);

  res.status(200).json({
    success: true,
    data: {},
    message: 'Post deleted successfully',
  });
});

/**
 * @desc    Like/Unlike a post (toggle)
 * @route   PUT /api/posts/:id/like
 * @access  Private
 */
const likePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new ErrorResponse(`Post not found with id of ${req.params.id}`, 404));
  }

  const userId = req.user._id;
  const alreadyLiked = post.likes.some(
    (like) => like.toString() === userId.toString()
  );

  if (alreadyLiked) {
    // Unlike: remove user from likes array
    post.likes = post.likes.filter(
      (like) => like.toString() !== userId.toString()
    );
  } else {
    // Like: add user to likes array
    post.likes.push(userId);

    // Create notification for the post author (only if not liking own post)
    if (post.author.toString() !== userId.toString()) {
      await Notification.create({
        recipient: post.author,
        sender: userId,
        type: 'like',
        post: post._id,
      });
    }
  }

  // Set likesCount and save
  post.likesCount = post.likes.length;
  await post.save();

  res.status(200).json({
    success: true,
    data: {
      likes: post.likes,
      likesCount: post.likesCount,
      liked: !alreadyLiked,
    },
  });
});

/**
 * @desc    Bookmark/Unbookmark a post (toggle)
 * @route   PUT /api/posts/:id/bookmark
 * @access  Private
 */
const bookmarkPost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new ErrorResponse(`Post not found with id of ${req.params.id}`, 404));
  }

  const user = await User.findById(req.user._id);
  const postId = post._id;

  const isBookmarked = user.bookmarks.some(
    (bookmark) => bookmark.toString() === postId.toString()
  );

  if (isBookmarked) {
    // Remove bookmark
    user.bookmarks = user.bookmarks.filter(
      (bookmark) => bookmark.toString() !== postId.toString()
    );
  } else {
    // Add bookmark
    user.bookmarks.push(postId);
  }

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    data: {
      bookmarks: user.bookmarks,
      bookmarked: !isBookmarked,
    },
  });
});

/**
 * @desc    Report a post
 * @route   PUT /api/posts/:id/report
 * @access  Private
 */
const reportPost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new ErrorResponse(`Post not found with id of ${req.params.id}`, 404));
  }

  const userId = req.user._id;

  // Check if user has already reported this post
  const alreadyReported = post.reportedBy.some(
    (reporter) => reporter.toString() === userId.toString()
  );

  if (alreadyReported) {
    return next(new ErrorResponse('You have already reported this post', 400));
  }

  // Add user to reportedBy and increment reportCount
  post.reportedBy.push(userId);
  post.reportCount += 1;

  // Auto-flag as reported if reportCount reaches 3 or more
  if (post.reportCount >= 3) {
    post.isReported = true;
  }

  await post.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: 'Post reported successfully',
    data: {
      reportCount: post.reportCount,
      isReported: post.isReported,
    },
  });
});

module.exports = {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  likePost,
  bookmarkPost,
  reportPost,
};
