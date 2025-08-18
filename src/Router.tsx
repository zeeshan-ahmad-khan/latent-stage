import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import LobbyPage from "./pages/LobbyPage";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import MainLayout from "./components/MainLayout";

// Define the router structure statically, outside of any component.
// This is the key to preventing the infinite loop.
const router = createBrowserRouter([
  {
    // Routes for logged-out users (like the login page)
    element: <PublicRoute />,
    children: [
      {
        path: "/login",
        element: <AuthPage />,
      },
    ],
  },
  {
    // Routes for logged-in users (like the lobby)
    element: <ProtectedRoute />,
    children: [
      {
        // The MainLayout is now the parent element for this group
        element: <MainLayout />,
        children: [
          {
            path: "/",
            element: <LobbyPage />,
          },
          // You can add more pages that need the header here
        ],
      },
    ],
  },
]);

// This component's only job is to provide the router to the app.
// It will not re-render in a loop.
const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
