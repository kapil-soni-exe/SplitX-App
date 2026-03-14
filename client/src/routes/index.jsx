import { createBrowserRouter } from "react-router-dom";
import RootRedirect from "../components/RootRedirect";
import Login from "../auth/Login";
import Signup from "../auth/Signup";
import AuthLayout from "../auth/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import Dashboard from "../pages/Dashboard_Page/Dashboard";
import Group from "../pages/Group_Page/Group";
import InviteCheck from "../pages/Group_Page/components/GroupList/InviteCheck";
import ProtectedRoute from "../components/ProtectedRoute";
import ProfilePage from "../pages/Profile_Page/ProfilePage";
import PageTransition from "../components/PageTransition";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootRedirect />,
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
            <PageTransition>
              <Dashboard />
            </PageTransition>
          </ProtectedRoute>
        ),
      },

      {
        path: "groups",
        element: (
          <ProtectedRoute>
            <PageTransition>
              <Group />
            </PageTransition>
          </ProtectedRoute>
        ),
      },
      {
        path:"profile",
        element:(
          <ProtectedRoute>
            <PageTransition>
              <ProfilePage/>
            </PageTransition>
          </ProtectedRoute>
        )
      }
    ],
  },
  {
    path: "/invite/:inviteCode",
    element: <InviteCheck />,
  },
]);
