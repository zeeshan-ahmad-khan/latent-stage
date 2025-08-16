import { useEffect } from "react";
import "./App.css";
import AppRouter from "./Router";
import { useAuthStore } from "./stores/authStore";

function App() {
  const { checkAuth, isAuthChecked } = useAuthStore((state) => ({
    checkAuth: state.checkAuth,
    isAuthChecked: state.isAuthChecked,
  }));

  // This runs only once when the app starts
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // While we check for a token, we show a simple loading screen.
  // This prevents any routing logic from running until we know the user's status.
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
