const express = require("express");
const router = express.Router();
const { authenticateJWT } = require("../auth/authenticateJWT");

const {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  unsendFriendRequest,
  removeFriend,
} = require("../controllers/friendRequestControllers");

router.use(authenticateJWT);

router.post("/sendFriendRequest", sendFriendRequest);

router.post("/acceptFriendRequest/:requestId", acceptFriendRequest);

router.post("/rejectFriendRequest/:requestId", rejectFriendRequest);

router.delete("/unsendFriendRequest", unsendFriendRequest);

router.post("/removeFriend", removeFriend);

module.exports = router;
