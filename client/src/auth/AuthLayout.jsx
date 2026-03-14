import React from 'react'
import "./Auth.css"
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

function AuthLayout() {
  const location = useLocation();
  const { user, loading } = useAuth();

  // While we're checking if the user is already logged in,
  // don't flash the login form — show nothing meaningful.
  if (loading) {
    return (
      <main className='auth-layout-awwwards'>
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </main>
    );
  }

  // If already logged in, send them to their intended page (or dashboard).
  if (user) {
    const redirectTo = location.state?.redirectTo || "/dashboard";
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <main className='auth-layout-awwwards'>
      {/* Dynamic Background Orbs */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>

      <section className="auth-card-wrapper">
        <div className="form-inner premium-glass">
            <img src="/logo1.png" alt="auth-log" className='auth-logo light' />
            <img src="/logo-light.png" alt="auth-log" className='auth-logo dark' />

            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.05, y: -10 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
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