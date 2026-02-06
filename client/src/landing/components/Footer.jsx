import React from 'react'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        {/* Left */}
        <p className="footer-copy">
          © {new Date().getFullYear()} SplitX. All rights reserved.
        </p>

        {/* Right */}
        <div className="footer-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Contact</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer