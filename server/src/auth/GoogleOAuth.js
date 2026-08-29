const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { UserModel } = require("../models/UserModel");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URI,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await UserModel.findOne({ email: profile.emails[0].value });

        if (user) {
          if (!user.oauthProvider) {
            user.oauthProvider = "google";
            user.oauthId = profile.id;
            user = await user.save();
          }

          done(null, user);
        } else {
          const newUser = new UserModel({
            username: profile.id,
            email: profile.emails[0].value,
            oauthProvider: "google",
            oauthId: profile.id,
            fullname: profile.displayName,
            verified: true,
          });

          const savedUser = await newUser.save();

          done(null, savedUser);
        }
      } catch (error) {
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserModel.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
