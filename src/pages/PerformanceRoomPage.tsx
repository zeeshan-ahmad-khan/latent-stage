import React, { Suspense } from "react";
import { useAuthStore } from "../stores/authStore"; // Import the auth store
import type { UserRole } from "../types";

// Lazy load both micro-frontends
const AudioPanel = React.lazy(() => import("audioMfe/AudioPanel"));
const ChatPanel = React.lazy(() => import("chatMfe/ChatPanel"));

const PerformanceRoomPage: React.FC = () => {
  // Get the token from our global authentication store
  const { token, user } = useAuthStore();

  return (
    <div style={styles.pageContainer}>
      {/* Left Panel (Audio MFE) */}
      <div style={styles.leftPanel}>
        <Suspense fallback={<div>Loading Audio...</div>}>
          {/* Pass the auth token down as a prop */}
          {token ? (
            <AudioPanel token={token} userRole={user?.role as UserRole} />
          ) : (
            <div>Authenticating...</div>
          )}
        </Suspense>
      </div>

      {/* Right Panel (Chat MFE) */}
      <div style={styles.rightPanel}>
        <Suspense fallback={<div>Loading Chat...</div>}>
          {/* We pass the token down as a prop to the ChatPanel */}
          {token ? <ChatPanel token={token} /> : <div>Authenticating...</div>}
        </Suspense>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  pageContainer: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
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
