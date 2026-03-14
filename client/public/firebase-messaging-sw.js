importScripts("https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCBKtwjN4zBNkJoG0GRwDorvmmgZhHP8tc",
  authDomain: "splitx-b7132.firebaseapp.com",
  projectId: "splitx-b7132",
  messagingSenderId: "496779460931",
  appId: "1:496779460931:web:66162fb1873f14fd592ff6"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {

  const { title, body } = payload.data;

  const options = {
    body,
    icon: "/logo1.png",
    data: {
      url: "/"
    }
  };

  self.registration.showNotification(title, options);

});

// click notification - open app
self.addEventListener("notificationclick", function (event) {

  event.notification.close();

  event.waitUntil(
    clients.openWindow("/")
  );

});