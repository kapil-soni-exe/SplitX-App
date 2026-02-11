import React, { useState } from "react";
import Input from "../components/comman/Input";
import Button from "../components/comman/Button";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api/auth.api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("")
    
    try{
      const res = await loginUser({email,password})
       console.log("login success:", res.data);

      navigate("/dashboard");
    }catch(err){
      setError(err.message || "Login failed");
    }

    
  };
  return (
    <div className="login-content">
      <div className="login-heading">
        <h1>Welcome back</h1>
        <p>Log in to manage your shared expenses</p>
      </div>

      <form onSubmit={handleLogin} className="form-fields">
        <Input
          id="email"
          type="email"
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          id="password"
          type="password"
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
        <span>
          <Link to="/signup">Create one</Link>
        </span>
      </p>
    </div>
  );
}

export default Login;
