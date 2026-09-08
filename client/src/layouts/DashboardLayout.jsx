import React, { useEffect, useState } from 'react'
import Sidebar from '../components/sidebar/Sidebar'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import "./dashboardLayout.css"
import Topbar from '../components/topbar/Topbar'
import BottomBar from '../components/Bottombar/BottomBar'


function DashboardLayout() {

  const [hideBottomBar, setHideBottomBar] = useState(false);
  const location = useLocation();



 const [isMobile, setIsMobile] = useState(
  window.innerWidth <= 768
);

useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);



  // Theme Toggle
  const[theme,setTheme]=useState(()=>{
    return localStorage.getItem("theme") || "light"
  })

  const themeToggle=()=>{
    const newTheme= theme=== "light"?"dark":"light"
    setTheme(newTheme)
    localStorage.setItem("theme",newTheme)
  }

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    
    // Dynamically update the theme-color meta tag for PWA
    let metaThemeColor = document.querySelector("meta[name=theme-color]");
    if (!metaThemeColor) {
      metaThemeColor = document.createElement("meta");
      metaThemeColor.name = "theme-color";
      document.head.appendChild(metaThemeColor);
    }
    const bgColor = getComputedStyle(document.documentElement).getPropertyValue('--bg-main').trim();
    metaThemeColor.content = bgColor;

  }, [theme]);
  return (
    <div className="dashboard-layout">
        <Sidebar />

     <div className="dashboard-main">
          <Topbar theme={theme} themeToggle={themeToggle} />
        <main className='dashboard-content'>
          <AnimatePresence mode="wait">
            <React.Fragment key={location.pathname}>
              <Outlet context={{ setHideBottomBar }}/>
            </React.Fragment>
          </AnimatePresence>
        </main>

        {isMobile && !hideBottomBar && <BottomBar />}

        </div>
    </div>
  )
}

export default DashboardLayout