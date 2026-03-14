const admin = require("../../../firebase/firebaseAdmin");

const User = require("../../models/users.model");

const sendPushNotification = async ({ tokens, title, body }) => {
  try {

    if (!tokens || tokens.length === 0) return;

    const message = {
      tokens,
      notification: {
        title,
        body
      },
      webpush: {
        headers: {
          Urgency: "high"
        },
        notification: {
          title,
          body,
          icon: "/logo1.png",
          requireInteraction: true,
        },
        fcm_options: {
          link: "https://splitx-app.vercel.app/" // Binds notification to PWA
        }
      }
    };

    const response = await admin.messaging().sendEachForMulticast(message);

    if (response.failureCount > 0) {
      const failedTokens = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          const errorCode = resp.error?.code;
          if (
            errorCode === "messaging/invalid-registration-token" ||
            errorCode === "messaging/registration-token-not-registered"
          ) {
            failedTokens.push(tokens[idx]);
          }
        }
      });

      if (failedTokens.length > 0) {
        // Cleanup expired/invalid tokens from the database
        await User.updateMany(
          { fcmToken: { $in: failedTokens } },
          { $unset: { fcmToken: 1 } }
        );
        console.log(`Cleaned up ${failedTokens.length} invalid FCM tokens.`);
      }
    }

  } catch (error) {
    console.error("Push notification error:", error);
  }
};

module.exports = sendPushNotification;