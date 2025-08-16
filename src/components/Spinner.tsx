import React from "react";

const Spinner: React.FC = () => <div style={styles.spinner}></div>;

const styles: { [key: string]: React.CSSProperties } = {
  spinner: {
    border: "3px solid rgba(255, 255, 255, 0.3)",
    borderTop: "3px solid #ffffff",
    borderRadius: "50%",
    width: "16px",
    height: "16px",
    animation: "spin 1s linear infinite",
  },
};

export default Spinner;
