import {initializeApp} from "firebase/app"
import { getMessaging, onMessage } from "firebase/messaging"


const firebaseConfig = {
  apiKey: "AIzaSyCBKtwjN4zBNkJoG0GRwDorvmmgZhHP8tc",
  authDomain: "splitx-b7132.firebaseapp.com",
  projectId: "splitx-b7132",
  storageBucket: "splitx-b7132.firebasestorage.app",
  messagingSenderId: "496779460931",
  appId: "1:496779460931:web:66162fb1873f14fd592ff6"
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);


// 👇 foreground notifications
onMessage(messaging, (payload) => {

  console.log("Foreground notification:", payload);

  const { title, body } = payload.notification;

  new Notification(title, {
    body,
    icon: "/logo1.png"
  });

});