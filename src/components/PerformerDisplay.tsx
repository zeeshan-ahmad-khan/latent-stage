import React from "react";
import { motion } from "framer-motion";

const PerformerDisplay: React.FC = () => {
  return (
    <motion.div
      style={styles.container}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div style={styles.timer}>14:59</div>
      <img
        src="https://placehold.co/150x150/eef2ff/4f46e5?text=LS"
        alt="Performer"
        style={styles.avatar}
      />
      <h2 style={styles.username}>@LiveSinger</h2>
      <p style={styles.talent}>Singer / Songwriter</p>
    </motion.div>
  );
};

// ... (Add the same styles object from the host-app version here)
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundColor: "var(--surface)",
    borderRadius: "12px",
    padding: "3rem 2rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    border: "1px solid var(--border-color)",
    flex: 1,
    position: "relative",
  },
  timer: {
    position: "absolute",
    top: "1.5rem",
    right: "1.5rem",
    backgroundColor: "rgba(0,0,0,0.05)",
    padding: "0.5rem 1rem",
    borderRadius: "8px",
    fontSize: "1.1rem",
    fontWeight: "600",
    color: "var(--text-primary)",
  },
  avatar: {
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    border: "4px solid var(--accent)",
    marginBottom: "1.5rem",
  },
  username: { margin: 0, fontSize: "1.75rem" },
  talent: { margin: "0.25rem 0 0 0", color: "var(--text-secondary)" },
};

export default PerformerDisplay;
