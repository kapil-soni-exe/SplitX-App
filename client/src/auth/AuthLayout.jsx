import React from 'react'
import "./Auth.css"
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

function AuthLayout() {
  const location = useLocation();

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

            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                style={{ width: "100%" }}
              >
                <Outlet/>
              </motion.div>
            </AnimatePresence>
                
            </div>
        </section>

    </main>
  )
}

export default AuthLayout