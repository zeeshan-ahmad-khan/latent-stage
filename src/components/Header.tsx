import React from "react";
import { useAuthStore } from "../stores/authStore";

const Header: React.FC = () => {
  const { logout, user } = useAuthStore();

  return (
    <header style={styles.header}>
      <div style={styles.logo}>The Latent Stage</div>
      <div style={styles.userInfo}>
        {/* Display the username if it exists */}
        {user && <span>Welcome, {user.username}</span>}
        <button onClick={logout} style={styles.logoutButton}>
          Logout
        </button>
      </div>
    </header>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  header: {
    width: "100%",
    padding: "1rem 2rem",
    backgroundColor: "var(--surface)",
    borderBottom: "1px solid var(--border-color)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxSizing: "border-box",
  },
  logo: {
    fontWeight: "bold",
    fontSize: "1.25rem",
    color: "var(--accent)",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  logoutButton: {
    padding: "0.5rem 1rem",
    border: "1px solid var(--border-color)",
    borderRadius: "6px",
    backgroundColor: "transparent",
    color: "var(--text-secondary)",
    fontSize: "0.9rem",
    cursor: "pointer",
  },
};

export default Header;
