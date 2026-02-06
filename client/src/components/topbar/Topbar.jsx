import React from 'react'
import "./topbar.css"
import {  RiNotification4Fill } from "@remixicon/react";
import Button from '../comman/Button';
import MoonIcon from "../../assets/icons/moon.png"
import SunIcon from "../../assets/icons/sun.png";

function Topbar({theme,themeToggle}) {
    
  return (
    <header className="topbar">
        <div className="topbar-left">
        

        <h2 className='page-title'>Dashboard</h2>
        </div>

        <div className="topbar-right">
           {/* Theme Toggler */}
           <button className='icon-btn' onClick={themeToggle}>
            {theme==="light" ? (
                <img src={MoonIcon} alt="dark-theme"  />
            ) : (
                <img src={SunIcon} alt="light-theme"  />
            )}
           </button>

           <Button className='noti-btn'><RiNotification4Fill size={22}/></Button>
        </div>
    </header>
  )
}

export default Topbar