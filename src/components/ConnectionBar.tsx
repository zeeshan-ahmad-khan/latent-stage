import React from "react";
import { useChatStore } from "../stores/chatStore";

interface ConnectionBarProps {
  token: string;
  roomName: string;
}

const ConnectionBar: React.FC<ConnectionBarProps> = ({ token, roomName }) => {
  const { connect, disconnect, isConnected } = useChatStore();

  return (
    <div style={{ marginBottom: "1rem", display: "flex", gap: "10px" }}>
      <button
        onClick={() => connect(token, roomName)}
        disabled={isConnected}
        style={styles.button}
      >
        Connect
      </button>
      <button
        onClick={disconnect}
        disabled={!isConnected}
        style={styles.button}
      >
        Disconnect
      </button>
    </div>
  );
};

const styles = {
  button: {
    padding: "10px 16px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "var(--accent)",
    color: "white",
    cursor: "pointer",
    flex: 1,
  },
};

export default ConnectionBar;
