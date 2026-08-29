const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  category: { type: String, enum: ["friends", "post"], required: true },
  relatedUser: { type: Schema.Types.ObjectId, ref: "User" },
  relatedPost: { type: Schema.Types.ObjectId, ref: "Note" },
  createdAt: { type: Date, default: Date.now },
});

const notificationListSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  userNotifications: [notificationSchema],
  postNotifications: [notificationSchema],
});

const NotificationListModel = mongoose.model(
  "NotificationList",
  notificationListSchema
);

module.exports = { NotificationListModel };
