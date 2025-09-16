import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useScheduleStore, type Slot } from "../stores/scheduleStore";
import { getUserBookings } from "../services/userService";
import Spinner from "../components/Spinner";

const CANCELLATION_WINDOW_HOURS = 1.25;

const BookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Slot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { cancelBooking, fetchSchedule } = useScheduleStore();

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const data = await getUserBookings();
      setBookings(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch bookings.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (slotId: string) => {
    try {
      await cancelBooking(slotId);
      await fetchBookings(); // Re-fetch bookings after cancellation
      await fetchSchedule(); // Also re-fetch the main schedule
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const now = new Date();
  const upcomingBookings = bookings.filter((b) => new Date(b.startTime) >= now);
  const pastBookings = bookings.filter((b) => new Date(b.startTime) < now);

  if (isLoading) {
    return (
      <div style={styles.centered}>
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <div style={styles.centered}>{error}</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>My Bookings</h1>

      <section>
        <h2 style={styles.sectionHeader}>Upcoming</h2>
        {upcomingBookings.length > 0 ? (
          upcomingBookings.map((booking) => (
            <BookingItem
              key={booking._id}
              booking={booking}
              onCancel={handleCancel}
            />
          ))
        ) : (
          <p>No upcoming performances.</p>
        )}
      </section>

      <section>
        <h2 style={styles.sectionHeader}>Past</h2>
        {pastBookings.length > 0 ? (
          pastBookings.map((booking) => (
            <BookingItem key={booking._id} booking={booking} />
          ))
        ) : (
          <p>No past performances.</p>
        )}
      </section>
    </div>
  );
};

const BookingItem: React.FC<{
  booking: Slot;
  onCancel?: (slotId: string) => void;
}> = ({ booking, onCancel }) => {
  const startTime = new Date(booking.startTime);
  const isPast = startTime < new Date();

  const timeToSlotHours =
    (startTime.getTime() - new Date().getTime()) / (1000 * 60 * 60);
  const canCancel = !isPast && timeToSlotHours > CANCELLATION_WINDOW_HOURS;

  return (
    <motion.div
      style={{ ...styles.bookingItem, opacity: isPast ? 0.7 : 1 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div>
        <div style={styles.date}>
          {startTime.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
        <div style={styles.time}>
          {startTime.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
      {!isPast && onCancel && canCancel && (
        <button
          style={styles.cancelButton}
          onClick={() => onCancel(booking._id)}
        >
          Cancel
        </button>
      )}
    </motion.div>
  );
};

// --- STYLES ---
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: "2rem",
    maxWidth: "800px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "2rem",
  },
  sectionHeader: {
    marginTop: "2rem",
    marginBottom: "1rem",
    borderBottom: "1px solid var(--border-color)",
    paddingBottom: "0.5rem",
  },
  bookingItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem",
    backgroundColor: "var(--surface)",
    borderRadius: "8px",
    marginBottom: "1rem",
  },
  date: {
    fontWeight: 600,
  },
  time: {
    color: "var(--text-secondary)",
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
  centered: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "50vh",
  },
};

export default BookingsPage;
