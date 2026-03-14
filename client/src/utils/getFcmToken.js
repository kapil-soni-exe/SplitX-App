import { getToken } from "firebase/messaging";
import { messaging } from "../firebase/firebase";
import { updateFcmToken } from "../../api/notification.api";

export const generateFcmToken = async () => {
  try {

    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.log("Notification permission denied");
      return;
    }

    // check existing service worker
    let registration = await navigator.serviceWorker.getRegistration();

    if (!registration) {
      registration = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js"
      );
    }

    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: registration
    });

    if (!token) {
      console.log("No FCM token generated");
      return;
    }

     const storedToken = localStorage.getItem("fcmToken");

     if (storedToken === token) {
      console.log("FCM token already stored");
      return token;
    }

    console.log("FCM TOKEN:", token);

    await updateFcmToken(token);

    localStorage.setItem("fcmToken", token);

    return token;

  } catch (error) {

    console.error("FCM token generation error:", error);

  }
};