import React from "react";
import MessageList from "./components/MessageList";
import MessageInput from "./components/MessageInput";

const ChatPanel: React.FC = () => (
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
    <MessageInput />
  </div>
);

export default ChatPanel;
