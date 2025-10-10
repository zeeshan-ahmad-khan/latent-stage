import React from "react";
import { motion } from "framer-motion";
import { useAudioPanelProps } from "../AudioPanel"; // Import the context hook

const EmojiBar: React.FC = () => {
  // Get the trigger function from the parent context
  const { triggerEmojiAnimation } = useAudioPanelProps();
  const emojis = ["👏", "🔥", "😂", "🎉", "❤️"];

  // The click handler now also passes the mouse event
  const handleEmojiClick = (
    emoji: string,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    triggerEmojiAnimation(emoji, event.clientX, event.clientY);
  };

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
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          // Update the onClick handler
          onClick={(e) => handleEmojiClick(emoji, e)}
        >
          {emoji}
        </motion.button>
      ))}
    </motion.div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundColor: "var(--surface)",
    borderRadius: "12px",
    padding: "1rem",
    marginTop: "1.5rem",
    display: "flex",
    justifyContent: "space-around",
    border: "1px solid var(--border-color)",
    position: "relative",
    zIndex: 1,
  },
  emojiButton: {
    all: "unset",
    fontSize: "2rem",
    cursor: "pointer",
    transition: "transform 0.2s",
  },
};

export default EmojiBar;
