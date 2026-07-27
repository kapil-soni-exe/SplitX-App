import React from "react";
import { Link, useNavigate } from "react-router-dom";
import RegisterForm from "./RegisterForm";

function Signup() {
  const navigate = useNavigate();

  return (
    <div className="login-content">
      <div className="login-heading">
        <div className="mobile-logo-wrapper">
          <img src="/logo1.png" alt="SplitX Logo" className="mobile-auth-logo light-logo" />
          <img src="/logo-light.png" alt="SplitX Logo" className="mobile-auth-logo dark-logo" />
        </div>
        <h1>Create an account</h1>
        <p>Join SplitX to start tracking shared expenses</p>
      </div>

      <RegisterForm
        onSuccess={() => {
          navigate("/dashboard");
        }}
      />

      <p className="auth-switch">
        Already have an account?{" "}
        <Link to="/login" className="auth-link">Log in</Link>
      </p>
    </div>
  );
}

export default Signup;
