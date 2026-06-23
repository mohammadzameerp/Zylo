const express = require('express');
const router = express.Router();

const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  likePost,
  bookmarkPost,
  reportPost,
} = require('../controllers/postController');

const { protect } = require('../middleware/auth');
const { createLimiter } = require('../middleware/rateLimiter');
const upload = require('../middleware/upload');
const { validatePost, runValidation } = require('../middleware/validate');

// GET    /api/posts           - Get all posts (public)
router.get('/', getPosts);

// GET    /api/posts/:id       - Get single post (public)
router.get('/:id', getPost);

// POST   /api/posts           - Create post (protected, rate limited, with optional image upload)
router.post(
  '/',
  protect,
  createLimiter,
  upload.single('image'),
  validatePost,
  runValidation,
  createPost
);

// PUT    /api/posts/:id       - Update post (protected, owner/admin only)
router.put('/:id', protect, validatePost, runValidation, updatePost);

// DELETE /api/posts/:id       - Delete post (protected, owner/admin only)
router.delete('/:id', protect, deletePost);

// PUT    /api/posts/:id/like     - Like/unlike a post (protected)
router.put('/:id/like', protect, likePost);

// PUT    /api/posts/:id/bookmark - Bookmark/unbookmark a post (protected)
router.put('/:id/bookmark', protect, bookmarkPost);

// PUT    /api/posts/:id/report   - Report a post (protected)
router.put('/:id/report', protect, reportPost);

module.exports = router;
