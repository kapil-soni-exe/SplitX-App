
import React from "react";
import { NavLink } from "react-router-dom";
import "./BottomBar.css";
import { mobileNavItem } from "./mobileNavItem";


function BottomBar() {
  return (
    <nav className="bottom-nav">
      {mobileNavItem.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `bottom-nav-item ${isActive ? "active" : ""}`
            }
          >
            <Icon size={22} />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}

export default BottomBar;
