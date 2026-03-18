import React from "react";
import { useNavigate } from "react-router-dom";
import RegisterForm from "./RegisterForm";

function Signup() {
  const navigate = useNavigate();

  return (
    <div className="login-content">
      <div className="login-heading">
        <h1>Create your account</h1>
        <p>Start splitting expenses with ease</p>
      </div>

      <RegisterForm
        onSuccess={() => {
          navigate("/login");
        }}
      />
    </div>
  );
}

export default Signup;
