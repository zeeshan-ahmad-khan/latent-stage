// src/services/socketService.ts
import { io, Socket } from "socket.io-client";

const CHAT_SERVER_URL = "http://localhost:8080";
let socket: Socket;

export const connectWithToken = (token: string) => {
  // Disconnect any existing socket before creating a new one
  if (socket) {
    socket.disconnect();
  }

  // Connect to the server, passing the token for authentication
  socket = io(CHAT_SERVER_URL, {
    auth: {
      token,
    },
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error("Socket not initialized. Please connect first.");
  }
  return socket;
};
