const admin = require("../../../firebase/firebaseAdmin");

const sendPushNotification = async ({ tokens, title, body }) => {
  try {

    if (!tokens || tokens.length === 0) return;

    const message = {
      tokens,
      notification: {
        title,
        body
      }
    };

    await admin.messaging().sendEachForMulticast(message);

  } catch (error) {
    console.error("Push notification error:", error);
  }
};

module.exports = sendPushNotification;