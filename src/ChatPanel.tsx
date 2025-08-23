import React from "react";
import ConnectionBar from "./components/ConnectionBar";
import MessageList from "./components/MessageList";
import MessageInput from "./components/MessageInput";

// The ChatPanel will receive the auth token from the host app
interface ChatPanelProps {
  token: string;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ token }) => {
  const roomName = "main-stage"; // We can make this dynamic later

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
      <ConnectionBar token={token} roomName={roomName} />
      <MessageList />
      <MessageInput roomName={roomName} />
    </div>
  );
};

export default ChatPanel;
