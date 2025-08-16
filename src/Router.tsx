import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import LobbyPage from "./pages/LobbyPage";
import ProtectedRoute from "./components/ProtectedRoute"; // Import the new component

const router = createBrowserRouter([
  {
    path: "/login",
    element: <AuthPage />,
  },
  {
    // This is our protected route group
    element: <ProtectedRoute />,
    children: [
      {
        path: "/", // The lobby is now a child of the protected route
        element: <LobbyPage />,
      },
      // You can add more protected routes here later
    ],
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
