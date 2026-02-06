import React from "react";
import "./sidebar.css";
import SidebarItem from "./SidebarItem";
import SidebarUser from "./SidebarUser";
import { RiExchange2Line, RiLayout2Line,RiMoneyRupeeCircleLine,RiTeamLine } from "@remixicon/react";


const navItems = [
  { label: "Dashboard", path: "/dashboard",icon: <RiLayout2Line className="sidebar-icon" /> },
  { label: "Groups", path: "/groups", icon: <RiTeamLine className="sidebar-icon" />  },
  { label: "Expenses", path: "/expenses",icon: <RiMoneyRupeeCircleLine className="sidebar-icon" /> },
  { label: "Settlements", path: "/settlements",icon: <RiExchange2Line className="sidebar-icon" /> },
];

function Sidebar() {
  return (
    <aside className="sidebar" >
      <div className="sidebar-logo">
        <img src="/logo1.png" alt="auth-log" className='logo light' />
                <img src="/logo-light.png" alt="auth-log" className='logo dark' />
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item, idx) => {
          return <SidebarItem key={idx} icon={item.icon} path={item.path} label={item.label} />;
        })}
      </nav>
      <SidebarUser/>
    </aside>
  );
}

export default Sidebar;
