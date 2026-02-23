import React, { useState, useEffect } from "react";
import Input from "../components/comman/Input";
import Button from "../components/comman/Button";

function OtpForm({ email, onVerified }) {
  const [otp, setOtp] = useState("");
  const [cooldown, setCooldown] = useState(60);

  // Cooldown timer (UI demo purpose)
  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setTimeout(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleVerify = (e) => {
    e.preventDefault();

    // Fake success for UI demo
    if (otp.length === 6) {
      onVerified();
    }
  };

  const handleResend = () => {
    setCooldown(60); // restart timer
  };

  return (
    <div>
      <p style={{ marginBottom: "1rem" }}>
        We’ve sent a 6-digit code to <strong>{email}</strong>
      </p>

      <form onSubmit={handleVerify} className="form-fields">

        <Input
          id="otp"
          type="text"
          label="Enter OTP"
          placeholder="6-digit code"
          value={otp}
          maxLength={6}
          onChange={(e) => setOtp(e.target.value)}
        />

        <Button
          text="Verify Email"
          variant="primary"
          className="auth-submit"
          type="submit"
          disabled={otp.length !== 6}
        />
      </form>

      <div style={{ marginTop: "1rem" }}>
        <Button
          text={cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
          variant="secondary"
          onClick={handleResend}
          disabled={cooldown > 0}
        />
      </div>
    </div>
  );
}

export default OtpForm;
