import React, { Suspense } from "react";
import PerformerDisplay from "../components/room/PerformerDisplay";
import EmojiBar from "../components/room/EmojiBar";

// Placeholder for the chat MFE
const ChatPanelPlaceholder: React.FC = () => (
  <div
    style={{
      backgroundColor: "var(--surface)",
      borderRadius: "12px",
      border: "1px solid var(--border-color)",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "var(--text-secondary)",
    }}
  >
    Chat MFE will load here
  </div>
);

const PerformanceRoomPage: React.FC = () => {
  return (
    <div style={styles.pageContainer}>
      {/* Left Panel */}
      <div style={styles.leftPanel}>
        <PerformerDisplay />
        <EmojiBar />
      </div>

      {/* Right Panel (Chat) */}
      <div style={styles.rightPanel}>
        <ChatPanelPlaceholder />
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  pageContainer: {
    display: "flex",

    gap: "1.5rem",
    padding: "1.5rem",
    height: "100%",
    boxSizing: "border-box",
  },
  leftPanel: {
    flex: 2, // This makes the left panel take up 2/3 of the space
    display: "flex",
    flexDirection: "column",
  },
  rightPanel: {
    flex: 1, // This makes the right panel take up 1/3 of the space
    display: "flex",
    flexDirection: "column",
  },
};

export default PerformanceRoomPage;
