import React from "react";
import { motion } from "framer-motion";

const AdPlaceholder: React.FC = () => {
  return (
    <motion.div
      style={styles.adContainer}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      Ad Space
    </motion.div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  adContainer: {
    width: "100%", // Fill the parent
    height: "100%", // Fill the parent
    backgroundColor: "var(--primary-surface)",
    borderRadius: "12px",
    border: "1px solid var(--border-color)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "var(--text-secondary)",
  },
};

export default AdPlaceholder;
