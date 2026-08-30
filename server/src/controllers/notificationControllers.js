const { NotificationListModel } = require("../models/NotificationModel");

const getNotifications = async (req, res) => {
  const userId = req.user.id;

  try {
    const notificationList = await NotificationListModel.findOne({
      user: userId,
    })
      .populate({
        path: "userNotifications.relatedUser",
        select: "username",
      })
      .populate({
        path: "postNotifications.relatedUser",
        select: "username",
      })
      .populate({
        path: "postNotifications.relatedPost",
        select: "title",
      });
      
    // A user who has never received a notification has no list yet. Return the
    // same shape as a populated one so callers never have to special-case null.
    if (!notificationList) {
      return res
        .status(200)
        .json({ userNotifications: [], postNotifications: [] });
    }

    notificationList.userNotifications.sort((a, b) => b.createdAt - a.createdAt);
    notificationList.postNotifications.sort((a, b) => b.createdAt - a.createdAt);

    res.status(200).json(notificationList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const markNotificationsAsRead = async (req, res) => {
  const userId = req.user.id;
  const { notificationIds } = req.body;

  try {
    const notificationList = await NotificationListModel.findOne({
      user: userId,
    });

    if (!notificationList) {
      return res.status(404).json({ message: "No notifications found" });
    }

    notificationList.notifications.forEach((notification) => {
      if (notificationIds.includes(notification._id.toString())) {
        notification.read = true;
      }
    });

    await notificationList.save();

    res.status(200).json({ message: "Notifications marked as read" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { getNotifications, markNotificationsAsRead };
