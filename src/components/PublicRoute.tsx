import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

const PublicRoute: React.FC = () => {
  const { isAuthenticated, isAuthChecked } = useAuthStore((state) => ({
    isAuthenticated: state.isAuthenticated,
    isAuthChecked: state.isAuthChecked,
  }));

  // Wait for the auth check to complete.
  if (!isAuthChecked) {
    return <div>Loading...</div>;
  }

  // If the user is logged in, redirect them away from the login page.
  // Otherwise, show the login page.
  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;
