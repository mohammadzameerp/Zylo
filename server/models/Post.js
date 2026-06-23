const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Post content is required'],
    maxlength: [2000, 'Post content cannot exceed 2000 characters'],
    trim: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Post must have an author'],
  },
  category: {
    type: String,
    enum: [
      'general',
      'humor',
      'story',
      'confession',
      'question',
      'advice',
      'rant',
      'shower-thought',
    ],
    default: 'general',
  },
  tags: [
    {
      type: String,
      trim: true,
      lowercase: true,
    },
  ],
  image: {
    type: String, // File path for uploaded image
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  likesCount: {
    type: Number,
    default: 0,
  },
  commentsCount: {
    type: Number,
    default: 0,
  },
  isReported: {
    type: Boolean,
    default: false,
  },
  reportCount: {
    type: Number,
    default: 0,
  },
  reportedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexes for efficient querying
PostSchema.index({ createdAt: -1 });
PostSchema.index({ likesCount: -1 });
PostSchema.index({ category: 1 });

/**
 * Pre-save middleware: Synchronize likesCount with the actual likes array length.
 */
PostSchema.pre('save', function (next) {
  this.likesCount = this.likes.length;
  next();
});

module.exports = mongoose.model('Post', PostSchema);
