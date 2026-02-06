import React from 'react'
import "./Auth.css"
import { Outlet } from 'react-router-dom'

function AuthLayout() {
  return (
    <main className='layout'>
        <section className="left-screen">
            <div className="auth-content">
                <h2>Split Expenses,without confusion</h2>
                <p>Keep track of shared expenses and always know who owes whom.</p>
            </div>
        </section>

        <section className="auth-form">
            <div className="form-inner">
                <img src="/logo1.png" alt="auth-log" className='auth-logo light' />
                <img src="/logo-light.png" alt="auth-log" className='auth-logo dark' />

            <Outlet/>
                
            </div>
        </section>

    </main>
  )
}

export default AuthLayout