import React from "react";
import { useAuthStore } from "../stores/authStore";
import { UserRoles } from "../types";
import ProfileSettings from "../components/settings/ProfileSettings";
import SocialLinksSettings from "../components/settings/SocialLinksSettings";

const SettingsPage: React.FC = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Settings</h1>

      <ProfileSettings />

      {user?.role === UserRoles.Performer && (
        <div style={{ marginTop: "2rem" }}>
          <SocialLinksSettings />
        </div>
      )}
    </div>
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
};

export default SettingsPage;
