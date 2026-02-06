import { createBrowserRouter } from "react-router-dom";
import Landing from "../landing/Landing";
import Login from "../auth/Login";
import Signup from "../auth/Signup";
import AuthLayout from "../auth/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import Dashboard from "../pages/Dashboard_Page/Dashboard";
import Group from "../pages/Group_Page/Group";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    element: <AuthLayout />,
    children: [
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
    ],
  },

  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },

      { path: "groups", element: <Group /> },
    ],
  },
]);
