// src/stores/chatStore.ts
import { create } from "zustand";
import { connectWithToken } from "../services/socketService";
import type { Socket } from "socket.io-client";

interface Message {
  sender: string;
  message: string;
  timestamp: string;
}

interface ChatState {
  socket: Socket | null;
  isConnected: boolean;
  messages: Message[];
  connect: (token: string, roomName: string) => void;
  disconnect: () => void;
  sendMessage: (roomName: string, message: string) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  socket: null,
  isConnected: false,
  messages: [],

  connect: (token, roomName) => {
    const socket = connectWithToken(token);

    socket.on("connect", () => {
      set({ isConnected: true, socket, messages: [] });
      socket.emit("join_room", roomName);
    });

    socket.on("disconnect", () => {
      set({ isConnected: false, socket: null });
    });

    socket.on("receive_message", (message: Message) => {
      set((state) => ({ messages: [...state.messages, message] }));
    });
  },

  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
    }
  },

  sendMessage: (roomName, message) => {
    const { socket } = get();
    if (socket) {
      socket.emit("send_message", { roomName, message });
    }
  },
}));
