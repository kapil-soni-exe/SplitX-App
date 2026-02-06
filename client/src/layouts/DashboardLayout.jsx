import React, { useEffect, useState } from 'react'
import Sidebar from '../components/sidebar/Sidebar'
import { Outlet } from 'react-router-dom'
import "./dashboardLayout.css"
import Topbar from '../components/topbar/Topbar'
import BottomBar from '../components/Bottombar/BottomBar'


function DashboardLayout() {

  const [hideBottomBar, setHideBottomBar] = useState(false);



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

  useEffect(()=>{
    document.documentElement.setAttribute("data-theme",theme)

  }, [theme])
  return (
    <div className="dashboard-layout">
        <Sidebar />

     <div className="dashboard-main">
          <Topbar theme={theme} themeToggle={themeToggle} />
        <main className='dashboard-content'>
            <Outlet context={{ setHideBottomBar }}/>
        </main>

        {isMobile && !hideBottomBar && <BottomBar />}

        </div>
    </div>
  )
}

export default DashboardLayout