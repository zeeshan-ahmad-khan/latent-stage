import React from "react";
import { motion } from "framer-motion";
import { useRoomStore } from "../stores/roomStore";

// This component will only be visible to the performer
const PerformerControls: React.FC = () => {
  const { isMuted, toggleMute } = useRoomStore();

  return (
    <motion.div
      style={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <button onClick={toggleMute} style={styles.muteButton}>
        {isMuted ? "🎤 Unmute" : "🔇 Mute"}
      </button>
    </motion.div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: "1rem",
    display: "flex",
    justifyContent: "center",
  },
  muteButton: {
    padding: "1rem 2rem",
    fontSize: "1rem",
    fontWeight: "bold",
    color: "white",
    backgroundColor: "var(--accent-pink, #e06c75)",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default PerformerControls;
