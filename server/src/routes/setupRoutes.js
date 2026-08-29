const authRouter = require("./authRoutes");
const userRouter = require("./userRoutes");
const noteRouter = require("./noteRoutes");
const googleAuthRouter = require("./googleOAuthRoutes");
const friendRequestRouter = require("./friendRequestRoutes");
const messageRouter = require("./messageRoutes");
const notificationRouter = require("./notificationRoutes");

const setupRoutes = (app) => {
  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  app.use("/note", noteRouter);
  app.use("/google/auth", googleAuthRouter);
  app.use("/friendRequest", friendRequestRouter);
  app.use("/message", messageRouter);
  app.use("/notifications", notificationRouter);
};

module.exports = { setupRoutes };
