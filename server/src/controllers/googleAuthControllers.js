const { UserModel } = require("../models/UserModel");

const googleRedirectHandler = (req, res) => {
  const user = req.user;
  if (user.username === user.oauthId) {
    res.redirect("set-username");
  } else {
    res.redirect(process.env.CLIENT_DASHBOARD_URI);
  }
};

const setGoogleUsernamePageHandler = (req, res) => {
  if (!req.isAuthenticated() || req.user.username !== req.user.oauthId) {
    return res.redirect(process.env.CLIENT_URI);
  }

  res.render("register", {
    user: req.user,
    error: null,
    homeUrl: process.env.CLIENT_URI,
  });
};

const setGoogleUsernameHandler = async (req, res) => {
  try {
    if (!req.isAuthenticated() || req.user.username !== req.user.oauthId) {
      return res.redirect(process.env.CLIENT_URI);
    }

    const { username } = req.body;

    if (!username || username.trim().length === 0) {
      return res.render("set-username", {
        user: req.user,
        error: "Username cannot be empty.",
      });
    }

    const existingUser = await UserModel.findOne({ username }, { _id: 1 });
    if (
      existingUser &&
      existingUser._id.toString() !== req.user._id.toString()
    ) {
      return res.render("register", {
        user: req.user,
        error: "Username already exists. Please choose a different one.",
        homeUrl: process.env.CLIENT_URI,
      });
    }

    const result = await UserModel.updateOne(
      { _id: req.user._id },
      { $set: { username: username } }
    );

    if (result.nModified > 0 || result.modifiedCount > 0) {
      res.redirect(process.env.CLIENT_URI);
    } else {
      res.status(404).json({ message: "User not found or username unchanged" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const googleLogoutHandler = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.status(200).json({ message: "Logged out" });
  });
};

module.exports = {
  googleRedirectHandler,
  setGoogleUsernamePageHandler,
  setGoogleUsernameHandler,
  googleLogoutHandler,
};
