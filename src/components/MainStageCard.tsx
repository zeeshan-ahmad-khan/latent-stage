import React from "react";
import { motion } from "framer-motion";
import { useScheduleStore } from "../stores/scheduleStore";
import { useNavigate } from "react-router-dom";
import { UserRoles } from "../types";
import { useAuthStore } from "../stores/authStore";
import * as Tooltip from "@radix-ui/react-tooltip";

const MainStageCard: React.FC = () => {
  const { livePerformer, nextUpPerformer } = useScheduleStore();
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const handleJoinRoom = () => {
    const isUserThePerformerOnStage =
      user?._id === livePerformer?.performer?._id;
    if (user?.role !== UserRoles.Performer || isUserThePerformerOnStage) {
      navigate(`/room/${livePerformer?._id}`);
    }
  };

  const getInitials = (username = "") => {
    return username.charAt(0).toUpperCase();
  };

  const formatUpcomingDateTime = (startTime: string) => {
    const performanceDate = new Date(startTime);
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);

    const timeString = performanceDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    if (performanceDate.toDateString() === now.toDateString()) {
      return `AT ${timeString}`;
    }

    if (performanceDate.toDateString() === tomorrow.toDateString()) {
      return `TOMORROW AT ${timeString}`;
    }

    const dateString = performanceDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    });
    return `ON ${dateString} AT ${timeString}`;
  };

  // --- RENDER LOGIC ---

  // 1. LIVE NOW VIEW
  if (livePerformer) {
    const isUserAPerformer = user?.role === UserRoles.Performer;
    const isUserThePerformerOnStage =
      user?._id === livePerformer.performer?._id;

    // A performer who is NOT the one on stage should be blocked.
    const shouldBlockAccess = isUserAPerformer && !isUserThePerformerOnStage;

    const liveCard = (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onClick={handleJoinRoom}
        whileHover={{ scale: shouldBlockAccess ? 1 : 1.03 }}
        style={{
          ...styles.card,
          cursor: shouldBlockAccess ? "not-allowed" : "pointer",
        }}
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

    return (
      <Tooltip.Provider>
        {shouldBlockAccess ? (
          <Tooltip.Root>
            <Tooltip.Trigger asChild>{liveCard}</Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content style={styles.tooltipContent} sideOffset={5}>
                You must use an Audience account to watch a show.
                <Tooltip.Arrow style={styles.tooltipArrow} />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        ) : (
          liveCard // Render the card normally for everyone else
        )}
      </Tooltip.Provider>
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
          COMING UP {formatUpcomingDateTime(nextUpPerformer.startTime)}
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
  liveButton: {
    padding: "0.5rem 1rem",
    border: "1px solid #ef4444",
    borderRadius: "6px",
    backgroundColor: "#ef4444",
    color: "white",
    fontWeight: 600,
    cursor: "pointer",
  },
  tooltipContent: {
    borderRadius: "4px",
    padding: "10px 15px",
    fontSize: "15px",
    lineHeight: 1,
    color: "var(--accent)",
    backgroundColor: "white",
    boxShadow:
      "hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px",
  },
  tooltipArrow: {
    fill: "white",
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
