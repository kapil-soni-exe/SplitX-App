import React from "react";
import Input from "../components/comman/Input";
import Button from "../components/comman/Button";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../api/auth.api";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await registerUser({ name, email, password });
      console.log("signup success:", res.data);

      navigate("/login");
    } catch (err) {
      setError(err.message || "Signup failed");
    }
  };
  return (
    <div className="login-content">
      <div className="login-heading">
        <h1>Create your account</h1>
        <p>Start splitting expenses with ease</p>
      </div>

      <form onSubmit={handleSignup} className="form-fields">
        <Input
          id="name"
          type="text"
          label="Full Name"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

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
          text="Create Accont"
          variant="primary"
          className="auth-submit"
        />
      </form>

      <p className="auth-switch">
        Already have an account?{" "}
        <span>
          <Link to="/login">Login</Link>
        </span>
      </p>
    </div>
  );
}

export default Signup;
