import React from "react";
import MainStageCard from "../components/MainStageCard";
import ScheduleTimeline from "../components/ScheduleTimeline";
import AdPlaceholder from "../components/AdPlaceholder";

const LobbyPage: React.FC = () => {
  const adWidth = "22%";

  return (
    <div style={styles.lobbyContainer}>
      {/* Left Ad Column */}
      <div style={{ width: adWidth }}>
        <AdPlaceholder />
      </div>

      {/* Center Content Column (Scrollable) */}
      <div style={styles.centerColumn}>
        <MainStageCard />
        <ScheduleTimeline />
      </div>

      {/* Right Ad Column */}
      <div style={{ width: adWidth }}>
        <AdPlaceholder />
      </div>
    </div>
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
  sideColumn: {
    height: "100%",
  },
  centerColumn: {
    flex: 1, // Makes the center column take up the remaining space
    height: "100%",
    overflowY: "auto", // Allows ONLY this column to scroll
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
};

export default LobbyPage;
