import { Navigate } from "react-router-dom";
import Landing from "../landing/Landing";

/**
 * Detects if the app is running as an installed PWA (standalone mode).
 * Works across Android (Chrome), iOS (Safari), and desktop PWAs.
 */
const isPWA = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  window.matchMedia("(display-mode: fullscreen)").matches ||
  window.navigator.standalone === true; // iOS Safari

function RootRedirect() {
  // In PWA mode skip the landing page entirely → ProtectedRoute handles auth
  if (isPWA()) {
    return <Navigate to="/dashboard" replace />;
  }

  // In browser, show the normal landing page
  return <Landing />;
}

export default RootRedirect;
