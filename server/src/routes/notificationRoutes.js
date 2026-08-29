const express = require("express");
const router = express.Router();
const { authenticateJWT } = require("../auth/authenticateJWT");

const {
  getNotifications,
  markNotificationsAsRead,
} = require("../controllers/notificationControllers");

router.use(authenticateJWT);

router.get("/notifications", getNotifications);

router.put("/notifications/read", markNotificationsAsRead);

module.exports = router;
