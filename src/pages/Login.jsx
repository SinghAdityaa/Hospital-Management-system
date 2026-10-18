
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  Stethoscope,
  ArrowLeft,
} from "lucide-react";

import { useApp } from "../context/AppContext";

export default function Login() {
  const { login } = useApp();

  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) return;

    setError("");
    setLoading(true);

    try {
      await login(email.trim(), password);

      const redirectPath =
        location.state?.from?.pathname || "/dashboard";

      navigate(redirectPath, {
        replace: true,
      });
    } catch (err) {
      console.error("Login failed:", err);

      const status = err.response?.status;

      if (status === 400 || status === 401) {
        setError("Invalid email or password.");
      } else if (status === 403) {
        setError("You do not have permission to access this account.");
      } else if (status === 429) {
        setError("Too many login attempts. Please try again later.");
      } else if (err.code === "ECONNABORTED") {
        setError(
          "The server is taking too long to respond. Please try again."
        );
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(
          err.message || "Unable to log in. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-screen">
      <div className="login-side">
        <Link className="back-home" to="/">
          <ArrowLeft size={16} />
          Back to home
        </Link>

        <div className="login-side-content">
          <h1>Doctor Appointment System</h1>

          <p>
            Manage appointments, patients and healthcare services
            in one secure platform.
          </p>

          <div className="login-doctor" aria-hidden="true">
            <Stethoscope size={112} strokeWidth={1.2} />
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-box card">
          <div className="login-heading">
            <h2>
              <Stethoscope size={27} />
              Welcome Back
            </h2>

            <p>Login to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="form">
            <label>
              Email

              <div className="with-icon">
                <Mail size={18} />

                <input
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setError("");
                  }}
                  placeholder="Enter your email"
                  autoComplete="email"
                  required
                  disabled={loading}
                />
              </div>
            </label>

            <label>
              Password

              <div className="with-icon">
                <LockKeyhole size={18} />

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError("");
                  }}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  disabled={loading}
                />

                <button
                  type="button"
                  className="eye"
                  title={
                    showPassword ? "Hide password" : "Show password"
                  }
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                  onClick={() =>
                    setShowPassword((previous) => !previous)
                  }
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </label>

            <div className="form-options">
              <label className="checkbox">
                <input type="checkbox" disabled={loading} />
                Remember Me
              </label>

              <Link to="/forgot-password">
                Forgot Password?
              </Link>
            </div>

            {error && (
              <div className="error" role="alert">
                {error}
              </div>
            )}

            <button
              className="btn btn-primary full"
              type="submit"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="signup-line">
            New Patient?{" "}
            <Link to="/register">Register Here</Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export function ForgotPassword() {
  return (
    <main className="auth-page">
      <div className="card auth-card">
        <h2>Reset password</h2>

        <p className="muted">
          Password recovery is not available yet.
          Please contact support for assistance.
        </p>

        <Link className="btn btn-primary" to="/login">
          Back to login
        </Link>
      </div>
    </main>
  );
}
