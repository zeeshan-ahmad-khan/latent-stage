import React from "react";
import MainStageCard from "../components/MainStageCard";
import ScheduleTimeline from "../components/ScheduleTimeline";
import AdPlaceholder from "../components/AdPlaceholder";

const LobbyPage: React.FC = () => {
  // ✅ You can now change this value and the layout will work.
  // Try "15vw" or "25vw".
  const adWidth = "15vw";
  const sidePadding = "2rem";

  return (
    <div>
      {/* Left Ad (Fixed Position) */}
      <div
        style={{
          position: "fixed",
          left: sidePadding,
          top: sidePadding,
          bottom: sidePadding,
          width: adWidth,
        }}
      >
        <AdPlaceholder />
      </div>

      {/* Center Content (With Margin) */}
      <div
        style={{
          // These margins create the space for the fixed ads
          marginLeft: `calc(${adWidth} + ${sidePadding})`,
          marginRight: `calc(${adWidth} + ${sidePadding})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "2rem 0",
        }}
      >
        <MainStageCard />
        <ScheduleTimeline />
      </div>

      {/* Right Ad (Fixed Position) */}
      <div
        style={{
          position: "fixed",
          right: sidePadding,
          top: sidePadding,
          bottom: sidePadding,
          width: adWidth,
        }}
      >
        <AdPlaceholder />
      </div>
    </div>
  );
};

export default LobbyPage;
