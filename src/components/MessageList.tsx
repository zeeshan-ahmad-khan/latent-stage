import React from "react";
import { useChatStore } from "../stores/chatStore";

const MessageList: React.FC = () => {
  const messages = useChatStore((state) => state.messages);

  return (
    <div style={styles.container}>
      {messages.map((msg, index) => (
        <div key={index} style={{ marginBottom: "8px" }}>
          <strong style={{ color: "var(--accent)" }}>{msg.sender}:</strong>{" "}
          {msg.message}
        </div>
      ))}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    border: "1px solid var(--border-color)",
    height: "100%",
    flex: 1,
    overflowY: "auto",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "8px",
    textAlign: "left",
    backgroundColor: "var(--surface)",
  },
};

export default MessageList;
