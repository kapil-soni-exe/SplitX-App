import { io } from "socket.io-client"

const socket = io(import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:3000", {
  withCredentials: true,
  autoConnect: false,        // don't connect until user is logged in
})

socket.on("connect", () => {
  console.log("[Socket] Connected:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("[Socket] Disconnected:", reason);
});

socket.on("connect_error", (err) => {
  console.warn("[Socket] Connection error:", err.message);
});

export const connectSocket = () => {
  if (!socket.connected) socket.connect();
};

export const disconnectSocket = () => {
  if (socket.connected) socket.disconnect();
};

export default socket;