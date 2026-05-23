const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const {getNotificationForUser , markSingleNotifAsRead , markAllAsRead} = require("../controllers/notification.controller");

router.get("/",authMiddleware,getNotificationForUser);
router.put("/mark-all",authMiddleware,markAllAsRead);
router.put("/:notificationId",authMiddleware,markSingleNotifAsRead);

module.exports = router;