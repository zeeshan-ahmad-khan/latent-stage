import React from "react";
import PerformerDisplay from "./components/PerformerDisplay";
import EmojiBar from "./components/EmojiBar";

const AudioPanel: React.FC = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <PerformerDisplay />
      <EmojiBar />
    </div>
  );
};

export default AudioPanel;
