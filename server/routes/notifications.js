const express = require('express');
const router = express.Router();

const {
  getNotifications,
  markAsRead,
  markAllAsRead,
} = require('../controllers/notificationController');

const { protect } = require('../middleware/auth');

// All notification routes require authentication
router.use(protect);

// GET    /api/notifications              - Get user's notifications
router.get('/', getNotifications);

// PUT    /api/notifications/read-all     - Mark all notifications as read
// Note: This must be defined BEFORE /:id/read to avoid "read-all" being treated as an :id
router.put('/read-all', markAllAsRead);

// PUT    /api/notifications/:id/read     - Mark single notification as read
router.put('/:id/read', markAsRead);

module.exports = router;
