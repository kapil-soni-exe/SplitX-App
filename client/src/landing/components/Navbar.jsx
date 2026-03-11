import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import Button from "../../components/comman/Button";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
        <div className="logo">
          <img src="/logo1.png" alt="SplitX logo" className="logo-light" />
          <img
            src="/logo-light.png"
            alt="SplitX logo"
            className="logo-dark"
          />
        </div>

        {/* Links */}
        <div className="nav-links">
          <a href="#how-it-works">How it works</a>
          <a href="#feature">Features</a>
          <Link to="/login">Log in</Link>

          <Button
            text="Get Started"
            variant="primary"
            className="nav-cta"
            onClick={() => navigate("/signup")}
          />
        </div>

        {/* Hamburger Menu */}
        <button
          className={`hamburger ${mobileMenuOpen ? "active" : ""}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      {/* Mobile Menu */}
      <div className={`nav-mobile-menu ${mobileMenuOpen ? "active" : ""}`}>
        <a href="#how-it-works" onClick={handleNavLinkClick}>
          How it works
        </a>
        <a href="#feature" onClick={handleNavLinkClick}>
          Features
        </a>
        <Link to="/login" onClick={handleNavLinkClick}>
          Log in
        </Link>
        <Button
          text="Get Started"
          variant="primary"
          className="nav-cta"
          onClick={() => {
            navigate("/signup");
            handleNavLinkClick();
          }}
        />
      </div>
    </>
  );
}

export default Navbar;
