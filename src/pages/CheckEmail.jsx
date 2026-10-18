
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MailCheck, RefreshCw } from "lucide-react";

import {
  EMAIL_VERIFICATION_ENABLED,
  resendVerification,
} from "../services/emailVerificationService";

export default function CheckEmail() {
  const location = useLocation();

  const email = location.state?.email || "";

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResend = async () => {
    if (loading || !email) return;

    setLoading(true);
    setMessage("");
    setError("");

    try {
      await resendVerification(email);

      setMessage(
        "If your account is eligible, a new verification email has been sent."
      );
    } catch (err) {
      if (err.response?.status === 429) {
        setError(
          "Too many requests. Please wait before trying again."
        );
      } else {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Unable to resend verification email."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="card auth-card center">
        <div className="verification-icon">
          <MailCheck size={52} strokeWidth={1.5} />
        </div>

        <h2>Check your email</h2>

        {EMAIL_VERIFICATION_ENABLED ? (
          <>
            <p className="muted">
              Your registration request has been received.
              We've sent an email verification link to your
              registered email address.
            </p>

            {email && (
              <p>
                <strong>{email}</strong>
              </p>
            )}

            <p className="muted">
              Open the email and follow the verification
              link to activate your account.
            </p>

            <p className="muted text-small">
              If you don't see the email, check your spam
              or junk folder.
            </p>

            {message && (
              <div className="success" role="status">
                {message}
              </div>
            )}

            {error && (
              <div className="error" role="alert">
                {error}
              </div>
            )}

            {email && (
              <button
                type="button"
                className="btn btn-outline full"
                onClick={handleResend}
                disabled={loading}
              >
                <RefreshCw size={17} />

                {loading
                  ? "Sending..."
                  : "Resend verification email"}
              </button>
            )}
          </>
        ) : (
          <p className="muted">
            Email verification is not available yet.
            The backend verification service is still
            being configured.
          </p>
        )}

        <div className="spaced">
          <Link className="btn btn-primary full" to="/login">
            Back to login
          </Link>
        </div>
      </div>
    </main>
  );
}
