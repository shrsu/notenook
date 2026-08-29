const express = require("express");
const router = express.Router();
const { authenticateJWT } = require("../auth/authenticateJWT");

const {
  getUserDetails,
  getMyProfile,
  viewUserDetails,
  updateUser,
  updatePassword,
  updateAvatar,
  searchUsers,
} = require("../controllers/userControllers");

router.use(authenticateJWT);

router.get("/userDetails", getUserDetails);

router.get("/myProfile", getMyProfile);

router.get("/viewUserDetails/:userId", viewUserDetails);

router.patch("/update", updateUser);

router.patch("/update/password", updatePassword);

router.patch("/update/avatar", updateAvatar);

router.get("/searchUsers", searchUsers);

module.exports = router;
