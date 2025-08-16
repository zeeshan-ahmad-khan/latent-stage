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
      <div style={styles.logoCircle}>LS</div>
      <h1 style={styles.appName}>The Latent Stage</h1>
      <p style={styles.tagline}>Your Stage. Your Moment.</p>
    </motion.div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    // This is the only line that changed
    backgroundColor: "var(--background)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    borderRight: "1px solid var(--border-color)",
  },
  logoCircle: {
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
    fontWeight: 400,
  },
};

export default LogoPanel;
