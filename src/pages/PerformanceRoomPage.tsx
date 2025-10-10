import React, { Suspense, useEffect } from "react";
import { useAuthStore } from "../stores/authStore";
import { useScheduleStore } from "../stores/scheduleStore"; // Import schedule store
import { useNavigate } from "react-router-dom";
import { useSettingsStore } from "../stores/settingsStore";

const AudioPanel = React.lazy(() => import("audioMfe/AudioPanel"));
const ChatPanel = React.lazy(() => import("chatMfe/ChatPanel"));

const PerformanceRoomPage: React.FC = () => {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const livePerformer = useScheduleStore((state) => state.livePerformer);
  const fetchSchedule = useScheduleStore((state) => state.fetchSchedule);
  const settings = useSettingsStore((state) => state.settings);
  const navigate = useNavigate();

  // If the user lands here directly (e.g., refresh), fetch the schedule
  useEffect(() => {
    if (!livePerformer) {
      fetchSchedule();
    }
  }, [livePerformer, fetchSchedule]);

  // If there's no live performer after checking, redirect to lobby
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!livePerformer) {
        // navigate('/'); // Optional: redirect if no performer
      }
    }, 2000); // Give it a moment to fetch
    return () => clearTimeout(timer);
  }, [livePerformer, navigate]);

  if (!user || !token) {
    return <div>Authenticating...</div>;
  }

  if (!livePerformer || !settings) {
    return <div>Loading Stage...</div>;
  }

  return (
    <div style={styles.pageContainer}>
      <div style={styles.leftPanel}>
        <Suspense fallback={<div>Loading Audio...</div>}>
          <AudioPanel
            token={token}
            userRole={user.role}
            roomName={livePerformer._id}
            performer={livePerformer.performer}
            startTime={livePerformer.startTime}
            slotDuration={settings.SLOT_DURATION_MINUTES}
            performanceDuration={settings.PERFORMANCE_DURATION_MINUTES}
          />
        </Suspense>
      </div>
      <div style={styles.rightPanel}>
        <Suspense fallback={<div>Loading Chat...</div>}>
          <ChatPanel token={token} roomId={livePerformer._id} />
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
    overflow: "hidden",
  },
  rightPanel: {
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
};

export default PerformanceRoomPage;
