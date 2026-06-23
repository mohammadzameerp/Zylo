const fs = require('fs');
const path = require('path');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Notification = require('../models/Notification');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');

/**
 * @desc    Get all reported posts
 * @route   GET /api/admin/reported-posts
 * @access  Private/Admin
 */
const getReportedPosts = asyncHandler(async (req, res, next) => {
  const posts = await Post.find({ isReported: true })
    .populate('author', 'anonymousName avatar email')
    .sort({ reportCount: -1, createdAt: -1 })
    .lean();

  res.status(200).json({
    success: true,
    count: posts.length,
    data: posts,
  });
});

/**
 * @desc    Force delete any post (admin only)
 * @route   DELETE /api/admin/posts/:id
 * @access  Private/Admin
 */
const deletePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new ErrorResponse(`Post not found with id of ${req.params.id}`, 404));
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
    message: 'Post deleted by admin successfully',
  });
});

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/admin/stats
 * @access  Private/Admin
 */
const getDashboardStats = asyncHandler(async (req, res, next) => {
  const [totalUsers, totalPosts, totalComments, reportedPosts] =
    await Promise.all([
      User.countDocuments(),
      Post.countDocuments(),
      Comment.countDocuments(),
      Post.countDocuments({ isReported: true }),
    ]);

  res.status(200).json({
    success: true,
    data: {
      totalUsers,
      totalPosts,
      totalComments,
      reportedPosts,
    },
  });
});

module.exports = { getReportedPosts, deletePost, getDashboardStats };
