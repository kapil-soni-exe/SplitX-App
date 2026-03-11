import React from "react";
import Button from "../../components/comman/Button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Hero() {
  const navigate = useNavigate();

  return (
    <div className="hero">
      <div className="hero-grid"></div>
      
      {/* Decorative Orbs */}
      <motion.div 
        className="hero-orb orb-1"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <div className="hero-content">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h3 className="hero-subtitle">Simplify Shared Finances</h3>
        </motion.div>

        <motion.h1 
          className="hero-title"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          Split Expenses <br />
          <span className="text-gradient">Without The Awkwardness.</span>
        </motion.h1>

        <motion.p 
          className="hero-desc"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          Keep track of shared expenses, split bills fairly, and always know who owes whom. 
          Designed for friends, roommates, and unforgettable trips.
        </motion.p>
        
        <motion.div
          className="cta-wrapper"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <Button
            className="hero-cta-btn"
            text="Get Started Free"
            variant="primary"
            onClick={() => navigate("/signup")}
          />
        </motion.div>

        <motion.div 
          className="features-point"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <span>Smart group splits</span>
          <span className="dot">•</span>
          <span>Real-time balances</span>
          <span className="dot">•</span>
          <span>Clear settlement summary</span>
        </motion.div>
      </div>
    </div>
  );
}

export default Hero;
