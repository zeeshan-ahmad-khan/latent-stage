import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { useScheduleStore, type Slot } from "../stores/scheduleStore";
import { getUserBookings } from "../services/userService";
import Spinner from "../components/Spinner";
import { useSettingsStore } from "../stores/settingsStore";

const BookingsPage: React.FC = () => {
  const [upcomingBookings, setUpcomingBookings] = useState<Slot[]>([]);
  const [pastBookings, setPastBookings] = useState<Slot[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { cancelBooking, fetchSchedule } = useScheduleStore();

  const observer = useRef<IntersectionObserver>(null);
  const lastBookingElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isFetchingMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isFetchingMore, hasMore]
  );

  const fetchBookings = async (currentPage: number) => {
    // Differentiate between initial load and subsequent fetches
    if (currentPage === 1) setIsLoading(true);
    else setIsFetchingMore(true);

    try {
      const data = await getUserBookings(currentPage);
      if (currentPage === 1) {
        setUpcomingBookings(data.upcomingBookings);
        setPastBookings(data.pastBookings.bookings);
      } else {
        // Append new past bookings to the existing list
        setPastBookings((prev) => [...prev, ...data.pastBookings.bookings]);
      }
      setHasMore(data.pastBookings.currentPage < data.pastBookings.totalPages);
    } catch (err: any) {
      setError(err.message || "Failed to fetch bookings.");
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    fetchBookings(page);
  }, [page]);

  const handleCancel = async (slotId: string) => {
    try {
      await cancelBooking(slotId);
      // Reset and refetch all data after a cancellation
      setPage(1);
      setPastBookings([]);
      setUpcomingBookings([]);
      await fetchBookings(1);
      await fetchSchedule();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

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
          pastBookings.map((booking, index) => {
            // Add a ref to the last element to trigger loading more
            if (pastBookings.length === index + 1) {
              return (
                <div ref={lastBookingElementRef} key={booking._id}>
                  <BookingItem booking={booking} />
                </div>
              );
            }
            return <BookingItem key={booking._id} booking={booking} />;
          })
        ) : (
          <p>No past performances.</p>
        )}
        {isFetchingMore && (
          <div style={styles.centered}>
            <Spinner />
          </div>
        )}
      </section>
    </div>
  );
};

// The BookingItem component remains the same as before
const BookingItem: React.FC<{
  booking: Slot;
  onCancel?: (slotId: string) => void;
}> = ({ booking, onCancel }) => {
  const settings = useSettingsStore((state) => state.settings);
  const CANCELLATION_WINDOW_HOURS = settings?.CANCELLATION_WINDOW_HOURS ?? 1.25;
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
    height: "10vh",
  },
};

export default BookingsPage;
