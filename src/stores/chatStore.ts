import { create } from "zustand";
import { io, Socket } from "socket.io-client";

// This should be in a .env file, but for simplicity we'll define it here for now
const CHAT_SERVER_URL = import.meta.env.VITE_CHAT_SERVER_URL;

interface Message {
  sender: string;
  message: string;
  timestamp: string;
}

interface ChatState {
  socket: Socket | null;
  isConnected: boolean;
  messages: Message[];
  initSocket: (token: string, roomName: string) => void;
  cleanup: () => void;
  sendMessage: (roomName: string, message: string) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  socket: null,
  isConnected: false,
  messages: [],

  initSocket: (token, roomName) => {
    // --- FIX FOR DUPLICATE MESSAGES ---
    // This guard prevents a new socket from being created if one already exists.
    if (get().socket) {
      return;
    }

    const newSocket = io(CHAT_SERVER_URL, {
      auth: { token },
    });

    // We set the socket instance in the store immediately to prevent race conditions.
    set({ socket: newSocket });

    newSocket.on("connect", () => {
      set({ isConnected: true, messages: [] });
      newSocket.emit("join_room", roomName);
    });

    newSocket.on("disconnect", () => {
      set({ isConnected: false, socket: null });
    });

    // --- FIX FOR CHAT HISTORY ---
    // Add a new listener for the 'chat_history' event from the backend.
    newSocket.on("chat_history", (history: Message[]) => {
      set({ messages: history });
    });

    newSocket.on("receive_message", (message: Message) => {
      set((state) => ({ messages: [...state.messages, message] }));
    });

    newSocket.on("connect_error", (err) => {
      console.error("Connection Error:", err.message);
      // Clean up on connection error
      newSocket.disconnect();
      set({ isConnected: false, socket: null });
    });
  },

  cleanup: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      // Ensure the socket is nulled out in the state on cleanup.
      set({ socket: null, isConnected: false });
    }
  },

  sendMessage: (roomName, message) => {
    const { socket } = get();
    if (socket) {
      socket.emit("send_message", { roomName, message });
    }
  },
}));
