import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isAuthChecked } = useAuthStore((state) => ({
    isAuthenticated: state.isAuthenticated,
    isAuthChecked: state.isAuthChecked,
  }));

  // While we check for a token, show a loading message.
  // This is the key to preventing the infinite loop.
  if (!isAuthChecked) {
    return <div>Loading...</div>;
  }

  // If the check is done and the user is authenticated, show the requested page.
  // Otherwise, redirect them to the login page.
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
