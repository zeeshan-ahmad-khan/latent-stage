import React from "react";
import { motion } from "framer-motion";
import { useRoomStore } from "../stores/roomStore";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaYoutube,
  FaInstagram,
  FaFacebook,
} from "react-icons/fa";
import { RiUserShared2Line } from "react-icons/ri";
import type { UserRole } from "../types";

interface PerformerDisplayProps {
  userRole: UserRole;
}

const PerformerDisplay: React.FC<PerformerDisplayProps> = ({ userRole }) => {
  // We only get the state needed for the UI as requested
  const { isMuted, toggleMute, participants } = useRoomStore();
  const audienceCount = participants.length;

  // Since only one performer speaks, we will assume for the UI
  // that if the mic is unmuted, it is "speaking" for the glow effect.
  const isSpeaking = !isMuted;

  const socialLinks = {
    youtube: "https://youtube.com/user/placeholder",
    instagram: "https://instagram.com/placeholder",
    facebook: "https://facebook.com/placeholder",
  };

  // Simplified styles based on isMuted and isSpeaking
  const buttonBackgroundColor = isSpeaking
    ? "rgba(239, 68, 68, 0.2)"
    : "transparent";
  const buttonBorderColor = isSpeaking ? "#ef4444" : "var(--border-color)";
  const iconColor = isSpeaking ? "#ef4444" : "var(--text-primary)";

  return (
    <motion.div
      style={styles.container}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div style={styles.audienceCounter}>
        <RiUserShared2Line size={20} style={{ marginRight: "8px" }} />
        {audienceCount}
      </div>

      <div style={styles.socials}>
        <a
          href={socialLinks.youtube}
          target="_blank"
          rel="noopener noreferrer"
          style={styles.socialLink}
        >
          <FaYoutube size={24} color="#FF0000" />
        </a>
        <a
          href={socialLinks.instagram}
          target="_blank"
          rel="noopener noreferrer"
          style={styles.socialLink}
        >
          <FaInstagram size={24} color="#E4405F" />
        </a>
        <a
          href={socialLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          style={styles.socialLink}
        >
          <FaFacebook size={24} color="#1877F2" />
        </a>
      </div>

      <div style={styles.centerContent}>
        <img
          src="https://placehold.co/150x150/eef2ff/4f46e5?text=LS"
          alt="Performer"
          style={styles.avatar}
        />
        <h2 style={styles.username}>@LiveSinger</h2>
        <p style={styles.talent}>Singer / Songwriter</p>
        <div style={styles.timer}>15:00</div>
      </div>

      {userRole === "Performer" && (
        <motion.button
          onClick={toggleMute}
          style={{
            ...styles.muteButton,
            backgroundColor: buttonBackgroundColor,
            borderColor: buttonBorderColor,
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isSpeaking ? (
            <FaMicrophoneSlash size={32} color={iconColor} />
          ) : (
            <FaMicrophone size={32} color="#6c757d" />
          )}
        </motion.button>
      )}
    </motion.div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundColor: "var(--surface)",
    borderRadius: "12px",
    padding: "1.5rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    border: "1px solid var(--border-color)",
    flex: 1,
    position: "relative",
    justifyContent: "space-between",
  },
  audienceCounter: {
    position: "absolute",
    top: "1.5rem",
    right: "1.5rem",
    display: "flex",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.05)",
    padding: "0.5rem 1rem",
    borderRadius: "8px",
    fontSize: "1.1rem",
    fontWeight: "600",
    color: "var(--text-primary)",
  },
  socials: {
    position: "absolute",
    top: "1.5rem",
    left: "1.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  socialLink: {
    color: "var(--text-secondary)",
    transition: "transform 0.2s ease-in-out",
  },
  centerContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingTop: "2rem",
    width: "100%",
  },
  avatar: {
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    border: "4px solid var(--accent)",
    marginBottom: "1.5rem",
  },
  username: {
    margin: 0,
    fontSize: "1.75rem",
  },
  talent: {
    margin: "0.25rem 0 0 0",
    color: "var(--text-secondary)",
  },
  timer: {
    marginTop: "1rem",
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "var(--text-primary)",
  },
  muteButton: {
    background: "none",
    border: "2px solid",
    borderRadius: "50%",
    cursor: "pointer",
    width: "64px",
    height: "64px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease-in-out",
    marginTop: "1.5rem",
  },
};

export default PerformerDisplay;
