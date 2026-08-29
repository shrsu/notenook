const mongoose = require("mongoose");
const { UserModel } = require("../models/UserModel");
const { NotificationListModel } = require("../models/NotificationModel");

async function addNotification(
  userId,
  message,
  category,
  relatedUser,
  relatedPost = null
) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let user = await UserModel.findById(userId).session(session);

    if (!user.notificationList) {
      const newNotificationList = new NotificationListModel({ user: userId });
      await newNotificationList.save({ session });
      user.notificationList = newNotificationList._id;
      await user.save({ session });
    }

    let notificationList = await NotificationListModel.findById(
      user.notificationList
    ).session(session);

    const newNotification = {
      message,
      category,
      relatedUser,
      relatedPost,
    };

    if (category === "friends") {
      notificationList.userNotifications.push(newNotification);
    } else if (category === "post") {
      notificationList.postNotifications.push(newNotification);
    } else {
      throw new Error("Invalid notification category");
    }

    await notificationList.save({ session });

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}

module.exports = { addNotification };
