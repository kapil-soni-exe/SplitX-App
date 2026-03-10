import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";

function ProfileActions() {
  const {logout} = useAuth()

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    setIsDark(currentTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";

    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);

    setIsDark(!isDark);
  };

  return (
    <div className="profile-actions">
      

      {/* Theme Toggle */}
      <div className="profile-action theme-action">

        <span>Dark Mode</span>

        <label className="switch">
          <input
            type="checkbox"
            checked={isDark}
            onChange={toggleTheme}
          />
          <span className="slider"></span>
        </label>

      </div>

      <button className="profile-action logout" onClick={logout}>
        Logout
      </button>

    </div>
  );
}

export default ProfileActions;