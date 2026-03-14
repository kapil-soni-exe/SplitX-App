
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import "./BottomBar.css";
import { mobileNavItem } from "./mobileNavItem";


function BottomBar() {
  const location = useLocation();

  return (
    <nav className="bottom-nav">
      {mobileNavItem.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.path}
            to={item.path}
            className="bottom-nav-item"
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="nav-indicator"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className={`nav-content ${isActive ? "active" : ""}`}>
                  <Icon size={22} />
                  <span className="nav-label">{item.label}</span>
                </span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}

export default BottomBar;
