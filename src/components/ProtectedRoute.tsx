import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute: React.FC = () => {
  // --- Authentication Check ---
  // For now, we'll simulate the user's login status.
  // Later, we will replace this with a real check from our Zustand store.
  const isAuthenticated = false; // <-- CHANGE THIS to `true` to test the lobby

  if (!isAuthenticated) {
    // If the user is not authenticated, redirect them to the login page.
    return <Navigate to="/login" replace />;
  }

  // If the user is authenticated, render the child route component (e.g., LobbyPage).
  return <Outlet />;
};

export default ProtectedRoute;
