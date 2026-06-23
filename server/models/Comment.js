const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Comment content is required'],
    maxlength: [500, 'Comment cannot exceed 500 characters'],
    trim: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Comment must have an author'],
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: [true, 'Comment must be associated with a post'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

/**
 * Post-save middleware: Increment the commentsCount on the associated Post.
 */
CommentSchema.post('save', async function () {
  try {
    const Post = mongoose.model('Post');
    await Post.findByIdAndUpdate(this.post, {
      $inc: { commentsCount: 1 },
    });
  } catch (error) {
    console.error('Error incrementing commentsCount:', error.message);
  }
});

/**
 * Post-remove middleware: Decrement the commentsCount on the associated Post.
 * Handles both deleteOne and findOneAndDelete operations.
 */
CommentSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    try {
      const Post = mongoose.model('Post');
      await Post.findByIdAndUpdate(doc.post, {
        $inc: { commentsCount: -1 },
      });
    } catch (error) {
      console.error('Error decrementing commentsCount:', error.message);
    }
  }
});

CommentSchema.post('deleteOne', { document: true, query: false }, async function () {
  try {
    const Post = mongoose.model('Post');
    await Post.findByIdAndUpdate(this.post, {
      $inc: { commentsCount: -1 },
    });
  } catch (error) {
    console.error('Error decrementing commentsCount:', error.message);
  }
});

module.exports = mongoose.model('Comment', CommentSchema);
