const express = require('express');
const router = express.Router({ mergeParams: true });

const {
  getComments,
  createComment,
  deleteComment,
} = require('../controllers/commentController');

const { protect } = require('../middleware/auth');
const { createLimiter } = require('../middleware/rateLimiter');
const { validateComment, runValidation } = require('../middleware/validate');

// GET    /api/posts/:postId/comments  - Get comments for a post (public)
router.get('/', getComments);

// POST   /api/posts/:postId/comments  - Create comment (protected, rate limited)
router.post(
  '/',
  protect,
  createLimiter,
  validateComment,
  runValidation,
  createComment
);

// DELETE /api/comments/:id            - Delete comment (protected, owner/admin)
// Note: This route is mounted at /api/comments in server.js
router.delete('/:id', protect, deleteComment);

module.exports = router;
