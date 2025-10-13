import React, { Suspense, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { useScheduleStore } from "../stores/scheduleStore";
import { useSettingsStore } from "../stores/settingsStore";
import { usePerformanceStore } from "../stores/performanceStore";

const AudioPanel = React.lazy(() => import("audioMfe/AudioPanel"));
const ChatPanel = React.lazy(() => import("chatMfe/ChatPanel"));

const PerformanceRoomPage: React.FC = () => {
  const navigate = useNavigate();
  const { token, user } = useAuthStore();
  const { livePerformer } = useScheduleStore();
  const settings = useSettingsStore((state) => state.settings);

  const {
    performanceState,
    timeLeft,
    startPerformanceTimer,
    resetPerformanceState,
    isTimerRunning,
  } = usePerformanceStore();

  useEffect(() => {
    if (livePerformer && settings) {
      startPerformanceTimer(
        livePerformer.startTime,
        settings.PERFORMANCE_DURATION_MINUTES
      );
    }

    // ✅ FIX: The cleanup function of this effect is the perfect place to reset the state.
    // It runs when the user navigates away from this page.
    return () => {
      resetPerformanceState();
    };
  }, [livePerformer, settings, startPerformanceTimer, resetPerformanceState]);

  useEffect(() => {
    if (performanceState === "ended" && user?.role === "Performer") {
      navigate("/");
    }
    if (performanceState === "grace") {
      navigate("/");
    }
  }, [performanceState, user, navigate]);

  if (!user || !token || !livePerformer || !settings) {
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
            performanceState={performanceState}
            timeLeft={timeLeft}
            isTimerRunning={isTimerRunning}
          />
        </Suspense>
      </div>
      <div style={styles.rightPanel}>
        <Suspense fallback={<div>Loading Chat...</div>}>
          <ChatPanel
            token={token}
            roomId={livePerformer._id}
            disabled={performanceState !== "live"}
          />
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
