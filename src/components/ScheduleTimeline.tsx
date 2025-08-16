import React from "react";
import { motion } from "framer-motion";
import { useScheduleStore } from "../stores/scheduleStore";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 },
  },
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const ScheduleTimeline: React.FC = () => {
  const schedule = useScheduleStore((state) => state.schedule);

  return (
    <motion.div
      style={styles.timelineContainer}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h3 style={{ textAlign: "center" }}>Tonight's Schedule</h3>
      {schedule.map((slot, index) => (
        <ScheduleItem
          key={index}
          time={slot.time}
          performer={slot.performer?.username || ""}
          status={slot.status}
        />
      ))}
    </motion.div>
  );
};

const ScheduleItem: React.FC<{
  time: string;
  performer: string;
  status: string;
}> = ({ time, performer, status }) => (
  <motion.div style={styles.scheduleItem} variants={itemVariants}>
    <span>{time}</span>
    <span style={status === "booked" ? styles.booked : styles.available}>
      {status === "booked" ? performer : "[ Available Slot ]"}
    </span>
  </motion.div>
);

// --- Styles defined as an object in the same file ---
const styles: { [key: string]: React.CSSProperties } = {
  timelineContainer: {
    width: "100%",
    maxWidth: "500px",
    marginTop: "2rem",
  },
  scheduleItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "0.75rem 0",
    borderBottom: "1px solid var(--border-color)",
  },
  booked: {
    color: "var(--accent-blue)",
  },
  available: {
    color: "var(--accent-green)",
  },
};

export default ScheduleTimeline;
