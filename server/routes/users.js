const express = require('express');
const router = express.Router();

const {
  getProfile,
  updateProfile,
  getBookmarks,
  getUserStats,
} = require('../controllers/userController');

const { protect } = require('../middleware/auth');

// All user routes require authentication
router.use(protect);

// GET    /api/users/profile    - Get current user profile
router.get('/profile', getProfile);

// PUT    /api/users/profile    - Update current user profile
router.put('/profile', updateProfile);

// GET    /api/users/bookmarks  - Get bookmarked posts
router.get('/bookmarks', getBookmarks);

// GET    /api/users/stats      - Get user statistics
router.get('/stats', getUserStats);

module.exports = router;
