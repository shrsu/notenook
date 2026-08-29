require("dotenv").config({ path: ".env.test" });
require("../auth/LocalStrategy");

const express = require("express");
const app = express();
const passport = require("passport");
const session = require("express-session");

const {
  registerUser,
  loginUser,
  getSessionHandler,
} = require("../controllers/authControllers");

app.use(express.json());
app.use(passport.initialize());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.post("/register", registerUser);
app.post("/login", loginUser);
app.get("/session", getSessionHandler);

module.exports = { app };
