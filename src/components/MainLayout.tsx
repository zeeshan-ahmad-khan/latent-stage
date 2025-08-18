import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";

const MainLayout: React.FC = () => {
  return (
    <div style={styles.layoutContainer}>
      <Header />
      {/* The Outlet will now correctly fill the remaining vertical space */}
      <div style={styles.contentArea}>
        <Outlet />
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  layoutContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100vh", // Take up the full viewport height
  },
  contentArea: {
    flex: 1, // This makes the content area take up all remaining space
    display: "flex",
    overflow: "hidden", // Prevents this container from creating scrollbars
  },
};

export default MainLayout;
