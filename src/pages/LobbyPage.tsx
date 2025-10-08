import React, { useEffect } from "react";
import MainStageCard from "../components/MainStageCard";
import ScheduleTimeline from "../components/ScheduleTimeline";
import AdPlaceholder from "../components/AdPlaceholder";
import { useScheduleStore } from "../stores/scheduleStore";
import * as Tooltip from "@radix-ui/react-tooltip";

const LobbyPage: React.FC = () => {
  const adWidth = "22%";
  // ✅ FIX: We only need `fetchSchedule` from the store now.
  const fetchSchedule = useScheduleStore((state) => state.fetchSchedule);

  useEffect(() => {
    // 1. Fetch the initial schedule immediately when the page loads.
    fetchSchedule();

    // 2. Set up an interval to re-fetch the schedule every 30 seconds.
    // This is the polling mechanism.
    const intervalId = setInterval(() => {
      fetchSchedule();
    }, 15 * 1000); // 30 seconds

    // 3. Clean up the interval when the user leaves the page to prevent memory leaks.
    return () => clearInterval(intervalId);
  }, [fetchSchedule]);

  return (
    <Tooltip.Provider>
      <div style={styles.lobbyContainer}>
        <div style={{ width: adWidth }}>
          <AdPlaceholder />
        </div>
        <div style={styles.centerColumn}>
          <MainStageCard />
          <ScheduleTimeline />
        </div>
        <div style={{ width: adWidth }}>
          <AdPlaceholder />
        </div>
      </div>
    </Tooltip.Provider>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  lobbyContainer: {
    display: "flex",
    width: "100%",
    height: "100%",
    padding: "2rem",
    gap: "2rem",
    boxSizing: "border-box",
  },
  centerColumn: {
    flex: 1,
    height: "100%",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
};

export default LobbyPage;
