import React from "react";
import Button from "../comman/Button";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function SidebarUser() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const displayName = user?.name || "User";
  const displayEmail = user?.email || "";
  const avatarUrl = user?.avatar || user?.avatarUrl || null;
  const initial = displayName ? displayName.charAt(0).toUpperCase() : "U";

  return (
    <div className="sidebar-user">
      <div className="user-info">
        <div className="user-img">
          {avatarUrl ? (
            <img src={avatarUrl} alt={displayName} className="user-avatar-img" />
          ) : (
            <span>{initial}</span>
          )}
        </div>
        <div className="user-text">
          <p className="user-name">{displayName}</p>
          {displayEmail && <p className="user-email">{displayEmail}</p>}
        </div>
      </div>
      <Button
        text="Log out"
        onClick={handleLogout}
        variant="danger"
        className="logout-btn"
        aria-label="Log out of account"
      />
    </div>
  );
}

export default SidebarUser;