import { createBrowserRouter } from "react-router-dom";
import Landing from "../landing/Landing";
import Login from "../auth/Login";
import Signup from "../auth/Signup";
import AuthLayout from "../auth/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import Dashboard from "../pages/Dashboard_Page/Dashboard";
import Group from "../pages/Group_Page/Group";
import InviteCheck from "../pages/Group_Page/components/GroupList/InviteCheck";
import ProtectedRoute from "../components/ProtectedRoute";

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
        element: (
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
        ),
      },

      { path: "groups", element: (
        <ProtectedRoute>
          <Group/>
        </ProtectedRoute>
      ) },
    ],
  },
  {
    path:"/invite/:inviteCode",
    element:<InviteCheck/>
  }
]);
