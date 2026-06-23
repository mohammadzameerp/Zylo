const express = require('express');
const router = express.Router();

const {
  getReportedPosts,
  deletePost,
  getDashboardStats,
} = require('../controllers/adminController');

const { protect, authorize } = require('../middleware/auth');

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// GET    /api/admin/reported-posts  - Get all reported posts
router.get('/reported-posts', getReportedPosts);

// DELETE /api/admin/posts/:id       - Force delete a post
router.delete('/posts/:id', deletePost);

// GET    /api/admin/stats           - Get dashboard statistics
router.get('/stats', getDashboardStats);

module.exports = router;
