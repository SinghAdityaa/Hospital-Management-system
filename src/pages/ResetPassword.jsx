import React, { useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  LockKeyhole,
  Eye,
  EyeOff,
  BadgeCheck,
  CircleAlert,
} from "lucide-react";

import { resetPassword } from "../services/passwordResetService";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();

  // Capture token once, then hide it from the address bar
  const tokenRef = useRef(searchParams.get("token"));
  const token = tokenRef.current;

  if (token && window.location.search) {
    window.history.replaceState(
      window.history.state,
      "",
      window.location.pathname
    );
  }

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [invalidLink, setInvalidLink] = useState(!token);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await resetPassword(token, password, confirm);
      setDone(true);
    } catch (err) {
      const status = err.response?.status;

      if (status === 400 || status === 410) {
        const message = err.response?.data?.message;

        if (message && /password/i.test(message)) {
          setError(message);
        } else {
          setInvalidLink(true);
        }
      } else if (status === 429) {
        setError("Too many attempts. Please try again later.");
      } else if (err.code === "ECONNABORTED") {
        setError("The server is taking too long to respond. Please try again.");
      } else {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Unable to reset your password. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <main className="auth-page">
        <div className="card auth-card center">
          <BadgeCheck size={54} color="#16845d" aria-hidden="true" />
          <h2>Password updated</h2>
          <p className="muted" role="status">
            Your password has been reset. You can now log in with your new
            password.
          </p>
          <div className="spaced">
            <Link className="btn btn-primary full" to="/login">
              Continue to login
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (invalidLink) {
    return (
      <main className="auth-page">
        <div className="card auth-card center">
          <CircleAlert size={50} color="#c75d38" aria-hidden="true" />
          <h2>Link invalid or expired</h2>
          <p className="muted" role="alert">
            This password reset link is invalid or has expired. Please request a
            new one.
          </p>
          <div className="spaced">
            <Link className="btn btn-primary full" to="/forgot-password">
              Request new link
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <div className="card auth-card">
        <h2>Set a new password</h2>
        <p className="muted">Choose a new password for your account.</p>

        <form onSubmit={handleSubmit} className="form">
          <label>
            New password
            <div className="with-icon">
              <LockKeyhole size={18} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setError("");
                }}
                placeholder="At least 8 characters"
                autoComplete="new-password"
                required
                disabled={loading}
              />
              <button
                type="button"
                className="eye"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((previous) => !previous)}
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </label>

          <label>
            Confirm new password
            <div className="with-icon">
              <LockKeyhole size={18} />
              <input
                type={showPassword ? "text" : "password"}
                value={confirm}
                onChange={(event) => {
                  setConfirm(event.target.value);
                  setError("");
                }}
                placeholder="Re-enter your password"
                autoComplete="new-password"
                required
                disabled={loading}
              />
            </div>
          </label>

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
            {loading ? "Updating..." : "Reset password"}
          </button>
        </form>
      </div>
    </main>
  );
}