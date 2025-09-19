import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import { jwtDecode } from "jwt-decode"; // Import jwt-decode

const CHAT_SERVER_URL = import.meta.env.VITE_CHAT_SERVER_URL;

interface Message {
  sender: string;
  message: string;
  timestamp: string;
}

interface CurrentUser {
  username: string;
}

interface ChatState {
  socket: Socket | null;
  status: "connected" | "disconnected" | "connecting";
  messages: Message[];
  currentUser: CurrentUser | null;
  initSocket: (token: string, roomName: string) => void;
  cleanup: () => void;
  sendMessage: (roomName: string, message: string) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  socket: null,
  status: "disconnected",
  messages: [],
  currentUser: null,

  initSocket: (token, roomName) => {
    if (get().socket) {
      return;
    }

    try {
      const decoded: { username: string } = jwtDecode(token);
      set({ currentUser: { username: decoded.username } });
    } catch (error) {
      console.error("Failed to decode token:", error);
    }

    set({ status: "connecting" });
    const newSocket = io(CHAT_SERVER_URL, {
      auth: { token },
    });

    set({ socket: newSocket });

    newSocket.on("connect", () => {
      set({ status: "connected", messages: [] });
      newSocket.emit("join_room", roomName);
    });

    newSocket.on("disconnect", () => {
      set({ status: "disconnected", socket: null, currentUser: null });
    });

    newSocket.on("chat_history", (history: Message[]) => {
      set({ messages: history });
    });

    newSocket.on("receive_message", (message: Message) => {
      set((state) => ({ messages: [...state.messages, message] }));
    });

    newSocket.on("connect_error", (err) => {
      console.error("Connection Error:", err.message);
      newSocket.disconnect();
      set({ status: "disconnected", socket: null, currentUser: null });
    });
  },

  cleanup: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, status: "disconnected", currentUser: null });
    }
  },

  sendMessage: (roomName, message) => {
    const { socket } = get();
    if (socket) {
      socket.emit("send_message", { roomName, message });
    }
  },
}));
