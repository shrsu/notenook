const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const RedisStore = require("connect-redis").default;
const { redisClient } = require("../config/redisConfig");
const { rateLimiter } = require("./rateLimiter");

const setupMiddlewares = (app) => {
  const redisStore = new RedisStore({
    client: redisClient,
    prefix: "notenook:",
  });

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(
    cors({
      origin: process.env.CLIENT_URI,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      credentials: true,
    })
  );

  app.use(
    session({
      store: redisStore,
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 60000, httpOnly: true, sameSite: "strict" },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.use(
    rateLimiter({
      excludedRoutes: ["/auth", "/google/auth", "/message"],
      maxRequests: 30,
      windowSizeInSeconds: 60,
    })
  );
};
module.exports = { setupMiddlewares };
