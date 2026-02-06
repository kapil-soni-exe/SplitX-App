import React from 'react'
import Button from "../comman/Button"

function SidebarUser() {
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
      <Button text='Log out'  variant='danger' className='logout-btn'/>
        
    </div>
  )
}

export default SidebarUser