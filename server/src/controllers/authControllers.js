const { UserModel } = require("../models/UserModel");
const { userJoiSchema } = require("../validation/userJoiSchemas");
const { validateData } = require("../validation/validator");
const { UserOTPModel } = require("../models/UserOTPModel");
const {
  sendOTPVerificationEmail,
} = require("../functions/SendOTPVerificationMail");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const { username, fullname, email, password } = req.body;

    const { error } = validateData(
      { username, fullname, email, password },
      userJoiSchema
    );
    if (error) {
      return res.status(400).json({ message: error.details });
    }

    const existingEmail = await UserModel.exists({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    const existingUsername = await UserModel.exists({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username is already taken" });
    }

    const newUser = new UserModel({
      username,
      fullname,
      email,
      verified: false,
    });

    await newUser.setPassword(password);

    const savedUser = await newUser.save();

    await sendOTPVerificationEmail(savedUser._id, savedUser.email);

    res.status(201).json({
      _id: savedUser._id,
      email: savedUser.email,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const userOTP = await UserOTPModel.findOne({ userId });

    if (!userOTP || !(await userOTP.validateOTP(otp.toString()))) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { verified: true },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    await UserOTPModel.deleteOne({ userId });

    res
      .status(200)
      .json({ message: "OTP verified successfully", user: updatedUser });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.verified) {
      return res.status(400).json({ message: "User is already verified" });
    }

    await sendOTPVerificationEmail(user._id, user.email);

    res.status(200).json({ message: "OTP has been resent successfully" });
  } catch (error) {
    console.error("Error resending OTP:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const loginUser = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error("Error during authentication:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (!user) {
      if (info && info.message === "Incorrect password") {
        return res
          .status(401)
          .json({ message: "Incorrect username or password" });
      } else if (info && info.message === "User not found") {
        return res.status(404).json({ message: "User not Found" });
      } else {
        return res.status(401).json({ message: "Authentication failed" });
      }
    }

    if (!user.verified) {
      return res.status(403).json({
        _id: user._id,
        email: user.email,
        message: "Email not verified. Please verify your email to log in.",
      });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.SECRET_KEY,
      {
        expiresIn: "12hr",
      }
    );

    return res.status(200).json({ token });
  })(req, res, next);
};

const getSessionHandler = async (req, res) => {
  try {
    let userId;
    let username;
    let newToken;

    if (req.session?.passport?.user) {
      userId = req.session.passport.user;
      const user = await UserModel.findById(userId);
      if (user) {
        username = user.username;
        newToken = jwt.sign({ userId, username }, process.env.SECRET_KEY, {
          expiresIn: "12hr",
        });
      }
    } else {
      const authHeader = req.headers.authorization;
      if (authHeader) {
        const token = authHeader.split(" ")[1];
        try {
          const decoded = jwt.verify(token, process.env.SECRET_KEY);
          userId = decoded.userId;
          username = decoded.username;
        } catch (error) {
          return res.status(401).json({ message: "Invalid or expired token" });
        }
      } else {
        return res
          .status(401)
          .json({ message: "Authorization header missing" });
      }
    }

    if (!userId) {
      return res.status(401).json({ message: "Login first please" });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userData = {
      _id: user._id,
      username: user.username,
      fullname: user.fullname,
      email: user.email,
      numberOfNotes: user.notes.length,
      numberOfConnections: user.friends.length,
      avatar: user.avatar,
    };

    if (newToken) {
      return res.status(200).json({ user: userData, newToken });
    } else {
      return res.status(200).json({ user: userData });
    }
  } catch (error) {
    console.error("Error fetching session:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  registerUser,
  verifyOTP,
  resendOTP,
  loginUser,
  getSessionHandler,
};
