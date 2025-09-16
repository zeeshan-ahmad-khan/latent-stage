import { useEffect } from "react";
import "./App.css";
import AppRouter from "./Router";
import { useAuthStore } from "./stores/authStore";
import { useSettingsStore } from "./stores/settingsStore";

function App() {
  const { checkAuth, isAuthChecked } = useAuthStore();
  const { fetchSettings, isLoading: areSettingsLoading } = useSettingsStore();

  useEffect(() => {
    checkAuth();
    fetchSettings();
  }, [checkAuth]);

  // Show a loading screen until the initial auth check is complete
  if (!isAuthChecked || areSettingsLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="App">
      <AppRouter />
    </div>
  );
}

export default App;
