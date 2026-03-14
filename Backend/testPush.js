const { sendPushNotification } = require("./src/services/notification.service");

const token = "cRfkIj-YtGwykagvpIQLaS:APA91bFh-Mo-KVjA30_BdvXyDH_iye9SrxozPrRIY_9xnFUCa-WILrkfzmBMGDfhB_kV6A9Jc32Fvc3MwOTNClDwmUB7vEWZ0LvrwmKPlpDiWNzp5vXcAos"

sendPushNotification(
  token,
  "SplitX Test Notification",
  "Push notification working 🎉"
);