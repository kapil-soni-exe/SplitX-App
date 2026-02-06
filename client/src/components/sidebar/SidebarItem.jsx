import React from 'react'
import {NavLink} from "react-router-dom"

function SidebarItem({label,path,icon}) {
  return (
    <NavLink
      to={path}
     className={({ isActive }) =>
  isActive ? "sidebar-item sidebar-item-active" : "sidebar-item"
  }
    >{icon} {label}</NavLink>
  )
}

export default SidebarItem