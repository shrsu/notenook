const express = require("express");
const router = express.Router();
const passport = require("passport");

const {
  googleRedirectHandler,
  setGoogleUsernamePageHandler,
  setGoogleUsernameHandler,
  googleLogoutHandler,
} = require("../controllers/googleAuthControllers");

router.get(
  "/",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/redirect",
  passport.authenticate("google", {
    failureRedirect: process.env.CLIENT_LOGIN_URI,
  }),
  googleRedirectHandler
);

router.get("/set-username", setGoogleUsernamePageHandler);

router.post("/set-username", setGoogleUsernameHandler);

router.get("/logout", googleLogoutHandler);

module.exports = router;
