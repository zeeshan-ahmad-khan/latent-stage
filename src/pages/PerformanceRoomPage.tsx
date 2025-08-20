import React, { Suspense } from "react";

// Lazy load both micro-frontends
const AudioPanel = React.lazy(() => import("audioMfe/AudioPanel"));
const ChatPanel = React.lazy(() => import("chatMfe/ChatPanel"));

const PerformanceRoomPage: React.FC = () => {
  return (
    <div style={styles.pageContainer}>
      {/* Left Panel (Audio MFE) */}
      <div style={styles.leftPanel}>
        <Suspense fallback={<div>Loading Audio...</div>}>
          <AudioPanel />
        </Suspense>
      </div>

      {/* Right Panel (Chat MFE) */}
      <div style={styles.rightPanel}>
        <Suspense fallback={<div>Loading Chat...</div>}>
          {/* We will integrate the real chat MFE here later */}
          <ChatPanel />
        </Suspense>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  pageContainer: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr", // Left panel is twice as wide as the right
    gap: "1.5rem",
    padding: "1.5rem",
    height: "100%",
    boxSizing: "border-box",
  },
  leftPanel: {
    display: "flex",
    flexDirection: "column",
  },
  rightPanel: {
    display: "flex",
    flexDirection: "column",
  },
};

export default PerformanceRoomPage;
