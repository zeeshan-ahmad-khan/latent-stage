import React from "react";
import { motion } from "framer-motion";

const EmojiBar: React.FC = () => {
  const emojis = ["👏", "🔥", "😂", "🎉", "❤️"];

  return (
    <motion.div
      style={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {emojis.map((emoji, index) => (
        <motion.button
          key={index}
          style={styles.emojiButton}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {emoji}
        </motion.button>
      ))}
    </motion.div>
  );
};

// ... (Add the same styles object from the host-app version here)
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundColor: "var(--surface)",
    borderRadius: "12px",
    padding: "1rem",
    marginTop: "1.5rem",
    display: "flex",
    justifyContent: "space-around",
    border: "1px solid var(--border-color)",
  },
  emojiButton: {
    all: "unset",
    fontSize: "2rem",
    cursor: "pointer",
    transition: "transform 0.2s",
  },
};

export default EmojiBar;
