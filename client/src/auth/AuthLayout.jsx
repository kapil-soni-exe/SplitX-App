import React from 'react'
import "./Auth.css"
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

function AuthLayout() {
  const location = useLocation();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <main className="auth-layout-awwwards">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </main>
    );
  }

  if (user) {
    const redirectTo = location.state?.redirectTo || "/dashboard";
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <main className="auth-layout-awwwards">
      {/* Background ambient light orbs */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>

      <div className="auth-container">
        <div className="auth-split-card">
          
          {/* Left Branding Panel (Hidden on Mobile <900px) */}
          <div className="auth-left-panel">
            <div className="auth-brand-header">
              <img src="/logo1.png" alt="SplitX Logo" className="auth-brand-logo light-logo" />
              <img src="/logo-light.png" alt="SplitX Logo" className="auth-brand-logo dark-logo" />
            </div>

            <div className="auth-brand-hero">
              <h1 className="auth-hero-title">
                Split bills.<br />Not friendships.
              </h1>
              <p className="auth-hero-subtext">
                Track shared expenses, settle balances instantly, and manage group trips or roommate bills without the awkwardness.
              </p>
            </div>

            {/* Signature Floating Preview Mini-Cards */}
            <div className="floating-cards-wrapper">
              {/* Receive Card */}
              <div className="mini-card mini-card-receive">
                <div className="mini-card-avatar receive-avatar">
                  <span>J</span>
                </div>
                <div className="mini-card-info">
                  <span className="mini-card-name">Jay owes you</span>
                  <span className="mini-card-status">Trip Expense</span>
                </div>
                <div className="mini-card-amount receive-amount">
                  +₹1,250
                </div>
              </div>

              {/* Owe Card */}
              <div className="mini-card mini-card-owe">
                <div className="mini-card-avatar owe-avatar">
                  <span>S</span>
                </div>
                <div className="mini-card-info">
                  <span className="mini-card-name">You owe Sarah</span>
                  <span className="mini-card-status">Dinner Bill</span>
                </div>
                <div className="mini-card-amount owe-amount">
                  -₹420
                </div>
              </div>
            </div>

          </div>

          {/* Right Form Panel */}
          <div className="auth-right-panel">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                style={{ width: "100%" }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </main>
  );
}

export default AuthLayout;