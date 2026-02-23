import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RegisterForm from "./RegisterForm";
import OtpForm from "./OtpFrom";

function Signup() {
  const navigate = useNavigate();

  const [step, setStep] = useState("register");
  const [email, setEmail] = useState("");

  return (
    <div className="login-content">
      <div className="login-heading">
        <h1>Create your account</h1>
        <p>Start splitting expenses with ease</p>
      </div>

      {step === "register" && (
        <RegisterForm
          onSuccess={(registeredEmail) => {
            setEmail(registeredEmail);
            setStep("otp");
          }}
        />
      )}

      {step === "otp" && (
        <OtpForm
          email={email}
          onVerified={() => navigate("/login")}
        />
      )}
    </div>
  );
}

export default Signup;
