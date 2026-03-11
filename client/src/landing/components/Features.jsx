import React from 'react';
import { motion } from 'framer-motion';
import { Users, PieChart, Bell, History, ShieldCheck } from 'lucide-react';

function Features() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <section className="features-bento" id='feature'>
      <div className="features-headings">
        <h1 className="features-title">Everything you need.</h1>
        <p className="features-subtitle">
          Powerful tools designed for frictionless sharing.
        </p>
      </div>

      <motion.div 
        className="bento-grid"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Large Feature */}
        <motion.div className="bento-item span-2" variants={itemVariants}>
          <div className="bento-icon-wrapper"><Users size={28} /></div>
          <h3>Smart group splits</h3>
          <p>Automatically split expenses fairly across everyone in the group. Define custom percentages, exact amounts, or let the algorithm handle equal shares effortlessly.</p>
        </motion.div>

        {/* Medium Feature */}
        <motion.div className="bento-item" variants={itemVariants}>
          <div className="bento-icon-wrapper"><PieChart size={28} /></div>
          <h3>Real-time balances</h3>
          <p>Always know who owes whom with instant visual balance updates.</p>
        </motion.div>

        {/* Medium Feature */}
        <motion.div className="bento-item" variants={itemVariants}>
          <div className="bento-icon-wrapper"><ShieldCheck size={28} /></div>
          <h3>Clear settlements</h3>
          <p>Settle up without the awkward money conversations. One click.</p>
        </motion.div>

        {/* Small Feature */}
        <motion.div className="bento-item" variants={itemVariants}>
          <div className="bento-icon-wrapper"><History size={28} /></div>
          <h3>History</h3>
          <p>Track all past expenses easily.</p>
        </motion.div>

        {/* Small Feature */}
        <motion.div className="bento-item" variants={itemVariants}>
          <div className="bento-icon-wrapper"><Bell size={28} /></div>
          <h3>Alerts</h3>
          <p>Instant notifications.</p>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Features;