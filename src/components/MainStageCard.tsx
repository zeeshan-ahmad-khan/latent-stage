import React from "react";
import { motion } from "framer-motion";
import { useScheduleStore } from "../stores/scheduleStore";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook

const MainStageCard: React.FC = () => {
  const livePerformer = useScheduleStore((state) => state.livePerformer);
  const navigate = useNavigate(); // Get the navigate function from the router

  const handleJoinRoom = () => {
    // We'll use a static room name for now
    const roomName = "main-stage";
    navigate(`/room/${roomName}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      // Make the card clickable only if a performer is live
      onClick={livePerformer ? handleJoinRoom : undefined}
      // Add a pointer cursor to show it's clickable
      whileHover={{ scale: livePerformer ? 1.03 : 1 }}
      style={{ ...styles.card, cursor: livePerformer ? "pointer" : "default" }}
    >
      {livePerformer ? (
        <>
          <div style={styles.statusLive}>🔴 LIVE NOW</div>
          <img
            src={livePerformer.profilePictureUrl}
            alt="Performer"
            style={styles.performerImage}
          />
          <h2 style={styles.username}>{livePerformer.username}</h2>
          <p style={styles.talent}>{livePerformer.talent}</p>
        </>
      ) : (
        <>
          <div style={styles.statusOffAir}>⚪️ OFF AIR</div>
          <h2 style={styles.username}>The Stage is Quiet</h2>
          <p style={styles.offAirText}>Check the schedule for the next show.</p>
        </>
      )}
    </motion.div>
  );
};

// --- Styles defined as an object in the same file ---
const styles: { [key: string]: React.CSSProperties } = {
  card: {
    border: "1px solid var(--border-color)",
    borderRadius: "12px",
    padding: "2rem",
    textAlign: "center",
    backgroundColor: "var(--primary-surface)",
    width: "100%",
    maxWidth: "500px",
  },
  statusLive: {
    color: "var(--accent-pink)",
    fontWeight: "bold",
    marginBottom: "1rem",
  },
  statusOffAir: {
    color: "var(--text-secondary)",
    fontWeight: "bold",
    marginBottom: "1rem",
  },
  performerImage: {
    borderRadius: "50%",
    marginBottom: "1rem",
    width: "100px",
    height: "100px",
  },
  username: {
    margin: "0 0 0.5rem 0",
  },
  talent: {
    margin: 0,
    color: "var(--accent-green)",
  },
  offAirText: {
    margin: "0.5rem 0 0 0",
    color: "var(--text-secondary)",
  },
};

export default MainStageCard;
