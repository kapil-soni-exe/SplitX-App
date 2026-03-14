const Notification = require("../../models/notification.model");
const User = require("../../models/users.model");
const sendPushNotification = require("./sendPushNotification");

const createNotification = async ({
  userIds,
  title,
  message,
  type,
  metadata
}) => {

  try {

    if (!userIds || userIds.length === 0) return;

    // save notifications in DB
    const notifications = userIds.map(userId => ({
      user: userId,
      title,
      message,
      type,
      metadata
    }));

    await Notification.insertMany(notifications);

    // get FCM tokens
    const users = await User.find({
      _id: { $in: userIds },
      fcmToken: { $exists: true, $ne: null }
    });

    const tokens = users.map(u => u.fcmToken);

    // send push notification
    if (tokens.length > 0) {
      await sendPushNotification({
        tokens,
        title,
        body: message
      });
    }

  } catch (error) {

    console.error("Notification service error:", error);

  }

};

module.exports = createNotification;