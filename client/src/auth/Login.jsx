import React, { useState } from "react";
import Input from "../components/comman/Input";
import Button from "../components/comman/Button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { loginUser } from "../../api/auth.api";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const redirectTo = location.state?.redirectTo || "/dashboard";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
      const res = await loginUser({ email, password });
      setUser(res.data.user);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-content">
      <div className="login-heading">
        <div className="mobile-logo-wrapper">
          <img src="/logo1.png" alt="SplitX Logo" className="mobile-auth-logo light-logo" />
          <img src="/logo-light.png" alt="SplitX Logo" className="mobile-auth-logo dark-logo" />
        </div>
        <h1>Welcome back</h1>
        <p>Enter your credentials to access your account</p>
      </div>

      <form onSubmit={handleLogin} className="form-fields">
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
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
        {error && <p className="auth-error">{error}</p>}

        <Button
          text="Log in"
          type="submit"
          variant="primary"
          className="auth-submit"
        />
      </form>

      <p className="auth-switch">
        Don't have an account?{" "}
        <Link to="/signup" className="auth-link">Create account</Link>
      </p>
    </div>
  );
}

export default Login;
