import React, { useState } from "react";
import Input from "../components/comman/Input";
import Button from "../components/comman/Button";
import { registerUser } from "../../api/auth.api";

function RegisterForm({ onSuccess }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await registerUser({ name, email, password });
      onSuccess(email);
    } catch (err) {
      console.log("FULL ERROR:", err);
      console.log("RESPONSE:", err.response);
      setError(err?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignup} className="form-fields">
      <Input
        id="name"
        type="text"
        label="Full name"
        placeholder="Enter your full name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <Input
        id="email"
        type="email"
        label="Email address"
        placeholder="name@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <Input
        id="password"
        type="password"
        label="Password"
        placeholder="Create a strong password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {error && <p className="auth-error">{error}</p>}

      <Button
        text={loading ? "Creating..." : "Create account"}
        variant="primary"
        className="auth-submit"
        type="submit"
        disabled={loading}
      />
    </form>
  );
}

export default RegisterForm;
