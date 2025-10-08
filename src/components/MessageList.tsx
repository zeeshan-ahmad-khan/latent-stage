import React, { useEffect, useRef } from "react";
import { useChatStore } from "../stores/chatStore";

// A simple hashing function to get a consistent color for a username
const colorPalette = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#F7B801",
  "#5F4B8B",
  "#3D6E70",
  "#E94F37",
  "#9A031E",
  "#3C91E6",
  "#F487B6",
];

const getUserColor = (username: string) => {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash % colorPalette.length);
  return colorPalette[index];
};

const MessageList: React.FC = () => {
  const { messages } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto", block: "end" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div style={styles.container}>
      {messages.map((msg, index) => {
        const isPerformer = msg.role === "Performer";
        // const isCurrentUser = msg.sender === currentUser?.username;

        // Apply a translucent background if the message is from a performer
        const wrapperStyle: React.CSSProperties = isPerformer
          ? {
              ...styles.messageWrapper,
              backgroundColor: "rgba(79, 70, 229, 0.05)",
              borderRadius: "8px",
            }
          : styles.messageWrapper;

        return (
          <div key={index} style={wrapperStyle}>
            <strong style={{ color: getUserColor(msg.sender) }}>
              {msg.sender}:
            </strong>
            <span style={styles.messageContent}>{msg.message}</span>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    flex: 1,
    overflowY: "auto",
    padding: "10px",
    marginBottom: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "12px", // Add gap for spacing between messages
  },
  messageWrapper: {
    textAlign: "left",
    padding: "8px 10px",
    lineHeight: "1.4",
  },
  messageContent: {
    marginLeft: "6px",
    wordBreak: "break-word",
  },
};

export default MessageList;
