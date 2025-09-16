import React from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { FaCalendarAlt, FaCog } from "react-icons/fa";
import * as Tooltip from "@radix-ui/react-tooltip";

const Header: React.FC = () => {
  const { logout, user } = useAuthStore();

  return (
    <header style={styles.header}>
      <Link to="/" style={styles.logoLink}>
        <div style={styles.logo}>The Latent Stage</div>
      </Link>
      <div style={styles.userInfo}>
        {user && <span>Welcome, {user.username}</span>}

        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <Link to="/bookings" style={styles.iconButton}>
                <FaCalendarAlt size={20} />
              </Link>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content style={styles.tooltipContent} sideOffset={5}>
                My Bookings
                <Tooltip.Arrow style={styles.tooltipArrow} />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>

        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <Link to="/settings" style={styles.iconButton}>
                <FaCog size={20} />
              </Link>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content style={styles.tooltipContent} sideOffset={5}>
                Settings
                <Tooltip.Arrow style={styles.tooltipArrow} />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>

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
  logoLink: {
    textDecoration: "none",
    color: "inherit",
  },
  logo: {
    fontWeight: "bold",
    fontSize: "1.25rem",
    color: "var(--accent)",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "1.5rem",
  },
  iconButton: {
    color: "var(--text-secondary)",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
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
};

export default Header;
