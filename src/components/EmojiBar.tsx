import React from "react";
import { motion } from "framer-motion";
import { useAudioPanelProps } from "../AudioPanel";

const EmojiBar: React.FC<{ disabled?: boolean }> = ({ disabled }) => {
  const { triggerEmojiAnimation } = useAudioPanelProps();
  const emojis = ["👏", "🔥", "😂", "🎉", "❤️"];

  const handleEmojiClick = (
    emoji: string,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (disabled) return;
    triggerEmojiAnimation(emoji, event.clientX, event.clientY);
  };

  return (
    <motion.div
      style={{
        ...styles.container,
        opacity: disabled ? 0.5 : 1,
      }} /* ...motion props... */
    >
      {emojis.map((emoji, index) => (
        <motion.button
          key={index}
          style={{
            ...styles.emojiButton,
            cursor: disabled ? "not-allowed" : "pointer",
          }}
          whileHover={{ scale: disabled ? 1 : 1.15 }}
          whileTap={{ scale: disabled ? 1 : 0.9 }}
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
