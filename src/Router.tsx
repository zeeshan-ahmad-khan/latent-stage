import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import LobbyPage from "./pages/LobbyPage";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

const router = createBrowserRouter([
  {
    // Routes for logged-out users
    element: <PublicRoute />,
    children: [
      {
        path: "/login",
        element: <AuthPage />,
      },
    ],
  },
  {
    // Routes for logged-in users
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <LobbyPage />,
      },
    ],
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
