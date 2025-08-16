import React from "react";
import { motion } from "framer-motion";

const LogoPanel: React.FC = () => {
  return (
    <motion.div
      style={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* This div will eventually hold your logo image */}
      <div style={styles.logoContainer}>
        <span style={styles.logoText}>LS</span>
      </div>
      <h1 style={styles.appName}>The Latent Stage</h1>
      <p style={styles.tagline}>Your Stage. Your Moment.</p>
    </motion.div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundColor: "var(--surface)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%", // Ensure it fills its grid cell
    borderRight: "1px solid var(--border-color)",
  },
  // This container is now just for sizing and centering
  logoContainer: {
    width: "100px",
    height: "100px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  // The styles for the text itself
  logoText: {
    fontSize: "2.5rem",
    fontWeight: "600",
    color: "var(--accent)",
    // This adds the drop shadow
    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
  },
  appName: {
    fontSize: "1.75rem",
    fontWeight: "600",
    margin: "1.5rem 0 0.5rem 0",
  },
  tagline: {
    fontSize: "1rem",
    color: "var(--text-secondary)",
    margin: 0,
  },
};

export default LogoPanel;
