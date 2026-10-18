import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Link,
  useSearchParams,
} from "react-router-dom";

import {
  BadgeCheck,
  CircleAlert,
  LoaderCircle,
} from "lucide-react";

import {
  EMAIL_VERIFICATION_ENABLED,
  verifyEmail,
} from "../services/emailVerificationService";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const attempted = useRef(false);

  const [status, setStatus] = useState("loading");

  const [message, setMessage] = useState(
    "Verifying your email address..."
  );

  useEffect(() => {
    if (attempted.current) return;

    attempted.current = true;

    if (!EMAIL_VERIFICATION_ENABLED) {
      setStatus("error");
      setMessage(
        "Email verification is not available yet."
      );
      return;
    }

    if (!token) {
      setStatus("error");
      setMessage(
        "The verification link is invalid or incomplete."
      );
      return;
    }

    // Remove the token from the visible browser URL.
    window.history.replaceState(
      window.history.state,
      "",
      window.location.pathname
    );

    async function completeVerification() {
      try {
        await verifyEmail(token);

        setStatus("success");

        setMessage(
          "Your email has been verified successfully. You can now log in."
        );
      } catch (error) {
        const statusCode = error.response?.status;

        setStatus("error");

        if (
          statusCode === 400 ||
          statusCode === 410
        ) {
          setMessage(
            "This verification link is invalid or has expired."
          );
        } else if (statusCode === 409) {
          setMessage(
            "This email address may already be verified."
          );
        } else if (statusCode === 429) {
          setMessage(
            "Too many verification attempts. Please try again later."
          );
        } else {
          setMessage(
            "We couldn't verify your email. Please try again later."
          );
        }
      }
    }

    completeVerification();
  }, [token]);

  return (
    <main className="auth-page">
      <div className="card auth-card center">
        {status === "loading" && (
          <>
            <LoaderCircle
              size={48}
              color="#1671c9"
              aria-hidden="true"
            />

            <h2>Verifying email</h2>

            <p
              className="muted"
              role="status"
            >
              {message}
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <BadgeCheck
              size={54}
              color="#16845d"
              aria-hidden="true"
            />

            <h2>Email verified</h2>

            <p
              className="muted"
              role="status"
            >
              {message}
            </p>

            <div className="spaced">
              <Link
                className="btn btn-primary full"
                to="/login"
                state={{
                  verificationSuccess: true,
                }}
              >
                Continue to login
              </Link>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <CircleAlert
              size={50}
              color="#c75d38"
              aria-hidden="true"
            />

            <h2>
              Verification unsuccessful
            </h2>

            <p
              className="muted"
              role="alert"
            >
              {message}
            </p>

            <div className="spaced">
              <Link
                className="btn btn-outline full"
                to="/login"
              >
                Back to login
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}