
const sendPushNotification = async (token, title, body) => {
  if (!token) return;

  try {
    await admin.messaging().send({
      token: token,
      notification: {
        title: title,
        body: body
      }
    });

    console.log("Push notification sent");

  } catch (error) {
    console.error("FCM Error:", error);
  }
};

module.exports = { sendPushNotification };