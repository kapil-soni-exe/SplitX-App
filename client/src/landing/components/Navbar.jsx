import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import Button from "../../components/comman/Button";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  const navigate= useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
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
          onClick={()=> navigate("/signup")}
        />
      </div>
    </nav>
  );
}

export default Navbar;
