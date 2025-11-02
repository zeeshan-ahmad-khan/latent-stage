import React, { useState } from "react";
import { Rating } from "react-simple-star-rating";
import { motion, AnimatePresence } from "framer-motion";

interface RatingModalProps {
  show: boolean;
  onRate: (rating: number) => void;
  onClose: () => void;
}

const RatingModal: React.FC<RatingModalProps> = ({ show, onRate, onClose }) => {
  const [rating, setRating] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleRating = (rate: number) => {
    setRating(rate);
  };

  const handleSubmit = () => {
    if (rating > 0) {
      onRate(rating);
    }
    setIsSubmitted(true);
    setTimeout(() => {
      onClose(); // This will trigger the navigation in the parent
      setIsSubmitted(false);
      setRating(0);
    }, 2000); // Show "Thank you" for 2 seconds
  };

  const handleClose = () => {
    // If user clicks "Back", don't submit a rating
    onClose();
    setIsSubmitted(false);
    setRating(0);
  };

  return (
    <AnimatePresence>
      {show && (
        <div style={styles.overlay}>
          <motion.div
            style={styles.modal}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            {isSubmitted ? (
              <h2 style={styles.header}>Thank you for your feedback!</h2>
            ) : (
              <>
                <h2 style={styles.header}>Rate the Performance</h2>
                <div style={styles.stars}>
                  <Rating
                    onClick={handleRating}
                    initialValue={rating}
                    size={40}
                    fillColor="var(--star-yellow)" // ✅ Use CSS variable
                    emptyColor="#ccc"
                    allowFraction
                  />
                </div>
                <div style={styles.buttonContainer}>
                  <button
                    style={styles.submitButton}
                    onClick={handleSubmit}
                    disabled={rating === 0}
                  >
                    Submit
                  </button>
                  <button style={styles.closeButton} onClick={handleClose}>
                    Back to Lobby
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "var(--surface)",
    padding: "2rem",
    borderRadius: "12px",
    textAlign: "center",
    width: "90%",
    maxWidth: "400px",
  },
  header: {
    margin: "0 0 1.5rem 0",
  },
  stars: {
    marginBottom: "2rem",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  submitButton: {
    padding: "0.8rem 1.5rem",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "var(--accent)",
    color: "white",
    fontSize: "1rem",
    fontWeight: "500",
    cursor: "pointer",
  },
  closeButton: {
    padding: "0.8rem 1.5rem",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "transparent",
    color: "var(--text-secondary)",
    fontSize: "1rem",
    fontWeight: "500",
    cursor: "pointer",
  },
};

export default RatingModal;
