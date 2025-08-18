import { useEffect } from "react";
import "./App.css";
import AppRouter from "./Router";
import { useAuthStore } from "./stores/authStore";

function App() {
  const { checkAuth, isAuthChecked } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Show a loading screen until the initial auth check is complete
  if (!isAuthChecked) {
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
