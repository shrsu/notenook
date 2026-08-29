const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const argon2 = require("argon2");

const UserOTPSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    otp: {
      type: String,
      required: true,
    },
    expireAt: { type: Date, required: true, expires: 0 },
  },

  { timestamps: true }
);

UserOTPSchema.methods.setOTP = async function (otp) {
  try {
    this.otp = await argon2.hash(otp);
    this.expireAt = new Date(Date.now() + 10 * 60 * 1000);
  } catch (error) {
    throw new Error("Error hashing password");
  }
};

UserOTPSchema.methods.validateOTP = async function (otp) {
  try {
    return await argon2.verify(this.otp, otp);
  } catch (error) {
    return false;
  }
};

const UserOTPModel = mongoose.model("UserOTP", UserOTPSchema);

module.exports = { UserOTPModel };
