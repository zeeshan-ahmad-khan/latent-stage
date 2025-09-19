import React, { useEffect, useRef } from "react";
import { useChatStore } from "../stores/chatStore";

const MessageList: React.FC = () => {
  const { messages, currentUser } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div style={styles.container}>
      {messages.map((msg, index) => {
        const isCurrentUser = msg.sender === currentUser?.username;
        return (
          <div
            key={index}
            style={{
              ...styles.messageWrapper,
              alignSelf: isCurrentUser ? "flex-end" : "flex-start",
            }}
          >
            {!isCurrentUser && <div style={styles.sender}>{msg.sender}</div>}
            <div
              style={{
                ...styles.messageBubble,
                backgroundColor: isCurrentUser
                  ? "var(--accent)"
                  : "var(--surface)",
                color: isCurrentUser ? "white" : "var(--text-primary)",
              }}
            >
              {msg.message}
            </div>
            <div
              style={{
                ...styles.timestamp,
                textAlign: isCurrentUser ? "right" : "left",
              }}
            >
              {formatTimestamp(msg.timestamp)}
            </div>
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
  },
  messageWrapper: {
    display: "flex",
    flexDirection: "column",
    maxWidth: "70%",
    marginBottom: "12px",
  },
  sender: {
    fontSize: "0.8rem",
    color: "var(--text-secondary)",
    marginBottom: "4px",
    marginLeft: "10px",
  },
  messageBubble: {
    padding: "10px 15px",
    borderRadius: "18px",
  },
  timestamp: {
    fontSize: "0.75rem",
    color: "var(--text-secondary)",
    marginTop: "4px",
    margin: "0 10px",
  },
};

export default MessageList;
