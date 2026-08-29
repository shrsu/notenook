const express = require("express");
const router = express.Router();

const {
  registerUser,
  verifyOTP,
  resendOTP,
  getSessionHandler,
  loginUser,
} = require("../controllers/authControllers");

router.post("/register", registerUser);

router.post("/verifyOTP", verifyOTP);

router.post("/resendOTP", resendOTP);

router.post("/login", loginUser);

router.get("/getSession", getSessionHandler);

module.exports = router;
