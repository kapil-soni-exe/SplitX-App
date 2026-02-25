import React from 'react'
import Button from "../comman/Button"
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function SidebarUser() {
  const {logout} = useAuth()
  const navigate = useNavigate()

  const handleLogout= async()=>{
   await logout()
   navigate("/login");
  }

  return (
    <div className="sidebar-user">
        <div className="user-info">
            <div className="user-img">
                K
            </div>
            <div className="user-text">
                <p className="user-name">Kapil</p>
                <p className="user-email">Kapil@email.com</p>
            </div>
        </div>
      <Button text='Log out' onClick={handleLogout}  variant='danger' className='logout-btn'/>
        
    </div>
  )
}

export default SidebarUser