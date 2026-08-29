const JwtStrategy = require("passport-jwt").Strategy;
const passport = require("passport");
const { ExtractJwt } = require("passport-jwt");
const { UserModel } = require("../models/UserModel");
require("dotenv").config();

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET_KEY,
    },
    async (jwtPayload, done) => {
      try {
        const user = await UserModel.findById(jwtPayload.userId);

        if (!user) {
          return done(null, false);
        }

        return done(null, user);
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error("An error occurred in JwtStrategy:", error);
        } else {
          console.error("An error occurred in JwtStrategy:", error.message);
        }
        return done(error, false);
      }
    }
  )
);
