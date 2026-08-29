const express = require("express");
const router = express.Router();
const { authenticateJWT } = require("../auth/authenticateJWT");

const {
  getUsersForChat,
  sendMessage,
  getMessages,
} = require("../controllers/chatControllers");

router.use(authenticateJWT);

router.get("/getUsersForChat", getUsersForChat);

router.post("/send/:receiverId", sendMessage);

router.get("/messages/:userToChatId", getMessages);

module.exports = router;
