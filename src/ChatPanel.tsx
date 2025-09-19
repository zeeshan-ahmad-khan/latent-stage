import React, { useEffect } from "react";
import MessageList from "./components/MessageList";
import MessageInput from "./components/MessageInput";
import { useChatStore } from "./stores/chatStore";

export interface ChatPanelProps {
  token: string;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ token }) => {
  const roomName = "main-stage";
  const { initSocket, cleanup, status } = useChatStore();

  useEffect(() => {
    if (token) {
      initSocket(token, roomName);
    }
    return () => {
      cleanup();
    };
  }, [token, roomName, initSocket, cleanup]);

  const statusColors = {
    connected: "#10b981",
    disconnected: "#ef4444",
    connecting: "#f59e0b",
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={{ margin: 0 }}>Live Chat</h3>
        <div style={styles.statusIndicator}>
          <span
            style={{
              ...styles.statusDot,
              backgroundColor: statusColors[status],
            }}
          />
          {status}
        </div>
      </div>
      <MessageList />
      <MessageInput roomName={roomName} />
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    backgroundColor: "var(--background)",
    padding: "1rem",
    boxSizing: "border-box",
    borderRadius: "12px",
    border: "1px solid var(--border-color)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
    paddingBottom: "1rem",
    borderBottom: "1px solid var(--border-color)",
  },
  statusIndicator: {
    display: "flex",
    alignItems: "center",
    fontSize: "0.8rem",
    color: "var(--text-secondary)",
    textTransform: "capitalize",
  },
  statusDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    marginRight: "6px",
  },
};

export default ChatPanel;
