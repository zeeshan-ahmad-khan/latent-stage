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
import { useAudioPanelProps } from "../AudioPanel";

interface PerformerDisplayProps {
  userRole: UserRole;
}

const PerformerDisplay: React.FC<PerformerDisplayProps> = ({ userRole }) => {
  const { isMuted, toggleMute, participants } = useRoomStore();
  const { performer, timeLeft } = useAudioPanelProps();
  const audienceCount = participants.length;
  const isSpeaking = !isMuted;
  const isTimeWarning = timeLeft <= 180 && timeLeft > 0;

  const getInitials = (username = "") => username.charAt(0).toUpperCase();

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

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
        <h4 style={styles.socialsHeader}>Social Links</h4>
        {performer.socialLinks?.youtube && (
          <a
            href={performer.socialLinks.youtube}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.socialLink}
          >
            <FaYoutube size={24} color="#FF0000" />
          </a>
        )}
        {performer.socialLinks?.instagram && (
          <a
            href={performer.socialLinks.instagram}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.socialLink}
          >
            <FaInstagram size={24} color="#E4405F" />
          </a>
        )}
        {performer.socialLinks?.facebook && (
          <a
            href={performer.socialLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.socialLink}
          >
            <FaFacebook size={24} color="#1877F2" />
          </a>
        )}
      </div>

      <div style={styles.centerContent}>
        {performer.profilePictureUrl ? (
          <img
            src={performer.profilePictureUrl}
            alt="Performer"
            style={styles.avatar}
          />
        ) : (
          <div style={styles.avatarInitials}>
            {getInitials(performer.username)}
          </div>
        )}

        <h2 style={styles.username}>{performer.username}</h2>
        <p style={styles.talent}>{performer.bio || "Performer"}</p>
        <div
          style={{
            ...styles.timer,
            ...(isTimeWarning ? styles.timerWarning : {}),
          }}
        >
          {timeLeft > 0 ? formatTime(timeLeft) : "Performance has ended"}
        </div>
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
            <FaMicrophone size={32} color={iconColor} />
          ) : (
            <FaMicrophoneSlash size={32} color="#6c757d" />
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
  socialsHeader: {
    fontSize: "0.8rem",
    color: "var(--text-secondary)",
    fontWeight: 600,
    margin: 0,
    textTransform: "uppercase",
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
    objectFit: "cover",
  },
  avatarInitials: {
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    border: "4px solid var(--accent)",
    backgroundColor: "#eef2ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "4rem",
    fontWeight: "600",
    color: "var(--accent)",
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
  // --- NEW AND UPDATED TIMER STYLES ---
  timer: {
    marginTop: "1rem",
    fontSize: "3.5rem", // Made bigger
    fontWeight: "bold",
    color: "var(--text-primary)",
    backgroundColor: "rgba(0, 0, 0, 0.03)", // Translucent background
    border: "1px solid var(--border-color)", // Border
    borderRadius: "12px",
    padding: "0.5rem 1.5rem",
    transition: "color 0.3s ease-in-out, border-color 0.3s ease-in-out",
  },
  timerWarning: {
    color: "#ef4444", // Red color for warning
    borderColor: "rgba(239, 68, 68, 0.5)",
  },
  // --- END OF TIMER STYLES ---
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
