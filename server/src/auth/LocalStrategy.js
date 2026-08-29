const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { UserModel } = require("../models/UserModel");

passport.use(
  new LocalStrategy(async (usernameOrEmail, password, done) => {
    try {
      const isEmail = usernameOrEmail.includes("@");

      const query = isEmail
        ? { email: usernameOrEmail }
        : { username: usernameOrEmail };

      const user = await UserModel.findOne(query);
      if (!user || !(await user.validatePassword(password))) {
        if (!user) {
          return done(null, false, { message: "User not found" });
        } else {
          return done(null, false, { message: "Incorrect password" });
        }
      }

      return done(null, user);
    } catch (error) {
      console.error("Error during authentication:", error);
      return done(error);
    }
  })
);
