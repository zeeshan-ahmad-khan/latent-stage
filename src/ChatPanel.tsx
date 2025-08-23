import React, { useEffect } from "react";
import MessageList from "./components/MessageList";
import MessageInput from "./components/MessageInput";
import { useChatStore } from "./stores/chatStore";

export interface ChatPanelProps {
  token: string;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ token }) => {
  const roomName = "main-stage";
  const { initSocket, cleanup } = useChatStore();

  useEffect(() => {
    // When the component mounts, initialize the connection
    if (token) {
      initSocket(token, roomName);
    }

    // When the component unmounts (user leaves the page), clean up the connection
    return () => {
      cleanup();
    };
  }, [token, roomName, initSocket, cleanup]); // Dependencies for the effect

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        backgroundColor: "var(--background)",
        padding: "1rem",
        boxSizing: "border-box",
        borderRadius: "12px",
        border: "1px solid var(--border-color)",
      }}
    >
      <h3 style={{ textAlign: "center", margin: "0 0 1rem 0" }}>Chat</h3>
      <MessageList />
      <MessageInput roomName={roomName} />
    </div>
  );
};

export default ChatPanel;
