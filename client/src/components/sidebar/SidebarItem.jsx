import React from "react";
import { NavLink } from "react-router-dom";

function SidebarItem({ label, path, icon }) {
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        isActive ? "sidebar-item sidebar-item-active" : "sidebar-item"
      }
    >
      <span className="sidebar-icon-wrap">{icon}</span>
      <span className="sidebar-label">{label}</span>
    </NavLink>
  );
}

export default SidebarItem;