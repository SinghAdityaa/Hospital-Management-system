import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, MailCheck } from "lucide-react";

import { forgotPassword } from "../services/passwordResetService";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err) {
      const status = err.response?.status;

      if (status === 429) {
        setError("Too many requests. Please wait before trying again.");
      } else if (err.code === "ECONNABORTED") {
        setError("The server is taking too long to respond. Please try again.");
      } else if (status === 404) {
        // Don't reveal whether an account exists
        setSent(true);
      } else {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Unable to send the reset link. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <main className="auth-page">
        <div className="card auth-card center">
          <div className="verification-icon">
            <MailCheck size={52} strokeWidth={1.5} />
          </div>

          <h2>Check your email</h2>

          <p className="muted">
            If an account exists for <strong>{email.trim().toLowerCase()}</strong>,
            we've sent a link to reset your password.
          </p>

          <p className="muted text-small">
            If you don't see it, check your spam or junk folder.
          </p>

          <div className="spaced">
            <Link className="btn btn-primary full" to="/login">
              Back to login
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <div className="card auth-card">
        <h2>Forgot password?</h2>

        <p className="muted">
          Enter your registered email and we'll send you a link to reset your
          password.
        </p>

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
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>

        <div className="spaced">
          <Link className="btn btn-outline full" to="/login">
            Back to login
          </Link>
        </div>
      </div>
    </main>
  );
}