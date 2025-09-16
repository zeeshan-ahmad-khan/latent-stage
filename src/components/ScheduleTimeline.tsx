import React, { useState } from "react";
import { motion } from "framer-motion";
import { useScheduleStore, type Slot } from "../stores/scheduleStore";
import { useAuthStore } from "../stores/authStore";
import { UserRoles } from "../types";
import Spinner from "./Spinner";
import { useSettingsStore } from "../stores/settingsStore";

const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const today = new Date();
const tomorrow = new Date();
tomorrow.setDate(today.getDate() + 1);
const dayAfter = new Date();
dayAfter.setDate(today.getDate() + 2);

type TabKey = "today" | "tomorrow" | "dayAfter";

const ScheduleTimeline: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("today");
  const { todaySlots, tomorrowSlots, dayAfterTomorrowSlots, isLoading, error } =
    useScheduleStore();
  const user = useAuthStore((state) => state.user);

  const tabs = {
    today: { label: "Today", date: formatDate(today), slots: todaySlots },
    tomorrow: {
      label: "Tomorrow",
      date: formatDate(tomorrow),
      slots: tomorrowSlots,
    },
    dayAfter: {
      label: "Day After Tomorrow",
      date: formatDate(dayAfter),
      slots: dayAfterTomorrowSlots,
    },
  };

  const activeSlots = tabs[activeTab].slots;

  return (
    <div style={styles.timelineContainer}>
      <div style={styles.tabsHeader}>
        {(Object.keys(tabs) as TabKey[]).map((key) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            style={{
              ...styles.tabButton,
              ...(activeTab === key ? styles.activeTab : {}),
            }}
          >
            {tabs[key].label}
            <span style={styles.tabDate}>{tabs[key].date}</span>
          </button>
        ))}
      </div>

      <div style={styles.scrollableList}>
        {isLoading && <Spinner />}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!isLoading &&
          !error &&
          activeSlots.map((slot) => (
            <ScheduleItem key={slot._id} slot={slot} currentUser={user} />
          ))}
      </div>
    </div>
  );
};

const ScheduleItem: React.FC<{ slot: Slot; currentUser: any }> = ({
  slot,
  currentUser,
}) => {
  const { bookSlot, cancelBooking } = useScheduleStore();
  const [isBusy, setIsBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const settings = useSettingsStore((state) => state.settings);
  const CANCELLATION_WINDOW_HOURS = settings?.CANCELLATION_WINDOW_HOURS ?? 1.25;
  const LAST_MINUTE_WINDOW_HOURS = settings?.LAST_MINUTE_WINDOW_HOURS ?? 1.25;

  const handleBook = async () => {
    setIsBusy(true);
    setActionError(null);
    try {
      await bookSlot(slot._id);
    } catch (err: any) {
      setActionError(err.message);
    } finally {
      setIsBusy(false);
    }
  };

  const handleCancel = async () => {
    setIsBusy(true);
    setActionError(null);
    try {
      await cancelBooking(slot._id);
    } catch (err: any) {
      setActionError(err.message);
    } finally {
      setIsBusy(false);
    }
  };

  const time = new Date(slot.startTime).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const isPerformer = currentUser?.role === UserRoles.Performer;
  const isMyBooking = slot.performer?._id === currentUser?._id;

  const now = new Date();
  const slotStartTime = new Date(slot.startTime);
  const slotEndTime = new Date(slotStartTime.getTime() + 15 * 60 * 1000);
  const hasEnded = slotEndTime < now;

  const timeToSlotHours =
    (slotStartTime.getTime() - now.getTime()) / (1000 * 60 * 60);

  const canCancel = timeToSlotHours > CANCELLATION_WINDOW_HOURS;
  const isToday = slotStartTime.toDateString() === now.toDateString();
  const isLastMinute = timeToSlotHours <= LAST_MINUTE_WINDOW_HOURS;

  const canBookToday = isToday && isLastMinute;
  const canBookFuture = !isToday;

  return (
    <motion.div
      style={{ ...styles.scheduleItem, opacity: hasEnded ? 0.6 : 1 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div style={styles.slotInfo}>
        <span style={styles.time}>{time}</span>
        {/* ✅ FIX: Logic for displaying slot status */}
        {slot.status === "booked" ? (
          <span style={styles.booked}>
            {slot.performer?.username || "Booked"}
          </span>
        ) : (
          <span style={hasEnded ? styles.unavailable : styles.available}>
            {hasEnded ? "[ Unavailable ]" : "[ Available ]"}
          </span>
        )}
      </div>

      <div style={styles.actionContainer}>
        {/* ✅ FIX: Logic for displaying the correct action button or status */}
        {hasEnded && slot.status === "booked" && (
          <span style={styles.ended}>Ended</span>
        )}

        {isPerformer && !hasEnded && (
          <>
            {slot.status === "available" && (canBookToday || canBookFuture) && (
              <button
                onClick={handleBook}
                style={styles.bookButton}
                disabled={isBusy}
              >
                {isBusy ? <Spinner /> : "Book"}
              </button>
            )}
            {isMyBooking && (
              <button
                onClick={handleCancel}
                style={styles.cancelButton}
                disabled={isBusy || !canCancel}
              >
                {isBusy ? <Spinner /> : "Cancel"}
              </button>
            )}
          </>
        )}
      </div>
      {actionError && <p style={styles.actionError}>{actionError}</p>}
    </motion.div>
  );
};

// --- STYLES ---
const styles: { [key: string]: React.CSSProperties } = {
  timelineContainer: {
    width: "100%",
    maxWidth: "600px",
    marginTop: "2rem",
    display: "flex",
    flexDirection: "column",
    flex: 1,
    overflow: "hidden",
    backgroundColor: "var(--surface)",
    borderRadius: "12px",
    border: "1px solid var(--border-color)",
  },
  tabsHeader: {
    display: "flex",
    flexShrink: 0,
    borderBottom: "1px solid var(--border-color)",
  },
  tabButton: {
    flex: 1,
    padding: "1rem 0.5rem",
    border: "none",
    background: "transparent",
    color: "var(--text-secondary)",
    fontSize: "1rem",
    cursor: "pointer",
    borderBottom: "2px solid transparent",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.25rem",
  },
  activeTab: {
    color: "var(--accent)",
    borderBottom: "2px solid var(--accent)",
    fontWeight: 600,
  },
  tabDate: {
    fontSize: "0.8rem",
    fontWeight: 400,
  },
  scrollableList: {
    flex: 1,
    overflowY: "auto",
    padding: "1rem",
  },
  scheduleItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 0.5rem",
    borderBottom: "1px solid var(--border-color)",
    flexWrap: "wrap",
  },
  slotInfo: {
    display: "flex",
    alignItems: "center",
    gap: "1.5rem",
  },
  time: {
    fontWeight: 600,
    minWidth: "70px",
  },
  booked: {
    color: "#4f46e5",
    fontWeight: 500,
  },
  available: {
    color: "#10b981",
    fontStyle: "italic",
  },
  unavailable: {
    color: "var(--text-secondary)",
    fontStyle: "italic",
  },
  actionContainer: {
    marginLeft: "auto",
  },
  bookButton: {
    padding: "0.5rem 1rem",
    border: "1px solid #10b981",
    borderRadius: "6px",
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    color: "#10b981",
    fontWeight: 600,
    cursor: "pointer",
  },
  cancelButton: {
    padding: "0.5rem 1rem",
    border: "1px solid #ef4444",
    borderRadius: "6px",
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    color: "#ef4444",
    fontWeight: 600,
    cursor: "pointer",
  },
  ended: {
    color: "var(--text-primary)",
    fontWeight: 600,
    padding: "0.5rem 1rem",
  },
  actionError: {
    color: "#ef4444",
    width: "100%",
    textAlign: "right",
    fontSize: "0.8rem",
    marginTop: "0.5rem",
  },
};

export default ScheduleTimeline;
