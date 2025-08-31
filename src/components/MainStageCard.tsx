import React from "react";
import { motion } from "framer-motion";
import { useScheduleStore } from "../stores/scheduleStore";
import { useNavigate } from "react-router-dom";

const MainStageCard: React.FC = () => {
  // Read both the live and next-up performers from the store
  const { livePerformer, nextUpPerformer } = useScheduleStore();
  const navigate = useNavigate();

  const handleJoinRoom = () => {
    const roomName = "main-stage";
    navigate(`/room/${roomName}`);
  };

  const getInitials = (username = "") => {
    return username.charAt(0).toUpperCase();
  };

  const formatUpcomingTime = (startTime: string) => {
    const date = new Date(startTime);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // --- RENDER LOGIC ---

  // 1. LIVE NOW VIEW
  if (livePerformer) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onClick={handleJoinRoom}
        whileHover={{ scale: 1.03 }}
        style={{ ...styles.card, cursor: "pointer" }}
      >
        <div style={styles.statusLive}>🔴 LIVE NOW</div>
        {livePerformer.performer?.profilePictureUrl ? (
          <img
            src={livePerformer.performer.profilePictureUrl}
            alt="Performer"
            style={styles.performerImage}
          />
        ) : (
          <div style={styles.performerInitials}>
            {getInitials(livePerformer.performer?.username)}
          </div>
        )}
        <h2 style={styles.username}>{livePerformer.performer?.username}</h2>
      </motion.div>
    );
  }

  // 2. COMING UP NEXT VIEW
  else if (nextUpPerformer) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ ...styles.card, cursor: "default" }} // Not clickable
      >
        <div style={styles.statusUpcoming}>
          COMING UP AT {formatUpcomingTime(nextUpPerformer.startTime)}
        </div>
        {nextUpPerformer.performer?.profilePictureUrl ? (
          <img
            src={nextUpPerformer.performer.profilePictureUrl}
            alt="Performer"
            style={styles.performerImage}
          />
        ) : (
          <div style={styles.performerInitials}>
            {getInitials(nextUpPerformer.performer?.username)}
          </div>
        )}
        <h2 style={styles.username}>{nextUpPerformer.performer?.username}</h2>
      </motion.div>
    );
  }

  // 3. OFF AIR VIEW
  else {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ ...styles.card, cursor: "default" }}
      >
        <div style={styles.statusOffAir}>⚪️ OFF AIR</div>
        <h2 style={styles.username}>The Stage is Quiet</h2>
        <p style={styles.offAirText}>Check the schedule for the next show.</p>
      </motion.div>
    );
  }
};

const styles: { [key: string]: React.CSSProperties } = {
  card: {
    border: "1px solid var(--border-color)",
    borderRadius: "12px",
    padding: "2rem",
    textAlign: "center",
    backgroundColor: "var(--surface)",
    width: "100%",
    maxWidth: "500px",
  },
  statusLive: {
    color: "#ef4444",
    fontWeight: "bold",
    marginBottom: "1rem",
  },
  statusUpcoming: {
    color: "#3b82f6", // Blue color for upcoming
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
    objectFit: "cover",
  },
  performerInitials: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    backgroundColor: "#eef2ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "2.5rem",
    fontWeight: "600",
    color: "var(--accent)",
    margin: "0 auto 1rem auto",
  },
  username: {
    margin: "0 0 0.5rem 0",
  },
  offAirText: {
    margin: "0.5rem 0 0 0",
    color: "var(--text-secondary)",
  },
};

export default MainStageCard;
