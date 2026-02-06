import React from "react";
import Button from "../../components/comman/Button";
import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate()
  return (
    <div className="hero">
      <div className="hero-content">
        <h3>For friends, roommates & trips</h3>
        <h1>Split Expenses</h1>
        <p>
          Keep track of shared expenses, split bills fairly, and always know who
          owes whom without awkward money talks.
        </p>
        <Button
          className="cta-btn"
          text="Get Started"
          variant="primary"
          onClick={() => navigate("/signup")}
        />

        <div className="features-point">
          <span>Smart group splits</span>
          <span>Real-time balances</span>
          <span>Clear settlement summary</span>
        </div>
      </div>
    </div>
  );
}

export default Hero;
