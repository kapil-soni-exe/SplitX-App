import React from 'react';
import { motion } from 'framer-motion';

function Footer() {
  return (
    <footer className="footer-awwwards">
      <div className="footer-main">
        <h1 className="footer-massive-text">SplitX.</h1>
        <div className="footer-content">
          <div className="footer-info">
            <p className="footer-desc">Simplify your shared finances.</p>
            <p className="footer-copy">
               © {new Date().getFullYear()} SplitX. All rights reserved.
            </p>
          </div>
          
          <div className="footer-links-group">
            <div className="footer-column">
              <h4>Product</h4>
              <a href="#">Features</a>
              <a href="#">Pricing</a>
              <a href="#">Download</a>
            </div>
            <div className="footer-column">
              <h4>Company</h4>
              <a href="#">About</a>
              <a href="#">Blog</a>
              <a href="#">Contact</a>
            </div>
            <div className="footer-column">
              <h4>Legal</h4>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;