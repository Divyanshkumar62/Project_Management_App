const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notification.controller");
const auth = require("../middleware/auth");

// Get all notifications for the logged-in user
router.get("/", auth, notificationController.getNotifications);

// Mark notification as read
router.put("/:id/read", auth, notificationController.markAsRead);

// Delete notification
router.delete("/:id", auth, notificationController.deleteNotification);

module.exports = router;
