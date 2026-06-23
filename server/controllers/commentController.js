const Comment = require('../models/Comment');
const Post = require('../models/Post');
const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');

/**
 * @desc    Get comments for a specific post (paginated)
 * @route   GET /api/posts/:postId/comments
 * @access  Public
 */
const getComments = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  // Verify post exists
  const post = await Post.findById(postId);
  if (!post) {
    return next(new ErrorResponse(`Post not found with id of ${postId}`, 404));
  }

  const total = await Comment.countDocuments({ post: postId });
  const comments = await Comment.find({ post: postId })
    .populate('author', 'anonymousName avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const pages = Math.ceil(total / limit);

  res.status(200).json({
    success: true,
    count: comments.length,
    pagination: {
      page,
      limit,
      total,
      pages,
    },
    data: comments,
  });
});

/**
 * @desc    Create a comment on a post
 * @route   POST /api/posts/:postId/comments
 * @access  Private
 */
const createComment = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;
  const { content } = req.body;

  // Verify post exists
  const post = await Post.findById(postId);
  if (!post) {
    return next(new ErrorResponse(`Post not found with id of ${postId}`, 404));
  }

  // Create the comment
  let comment = await Comment.create({
    content,
    author: req.user._id,
    post: postId,
  });

  // Create notification for the post author (only if not commenting on own post)
  if (post.author.toString() !== req.user._id.toString()) {
    await Notification.create({
      recipient: post.author,
      sender: req.user._id,
      type: 'comment',
      post: postId,
    });
  }

  // Populate author for the response
  comment = await Comment.findById(comment._id)
    .populate('author', 'anonymousName avatar')
    .lean();

  res.status(201).json({
    success: true,
    data: comment,
  });
});

/**
 * @desc    Delete a comment
 * @route   DELETE /api/comments/:id
 * @access  Private (comment author or admin)
 */
const deleteComment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return next(
      new ErrorResponse(`Comment not found with id of ${req.params.id}`, 404)
    );
  }

  // Check ownership: only the comment author or an admin can delete
  if (
    comment.author.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    return next(new ErrorResponse('Not authorized to delete this comment', 403));
  }

  // Use findOneAndDelete to trigger the post middleware that decrements commentsCount
  await Comment.findOneAndDelete({ _id: comment._id });

  res.status(200).json({
    success: true,
    data: {},
    message: 'Comment deleted successfully',
  });
});

module.exports = { getComments, createComment, deleteComment };
