
import api from "./api";

export const EMAIL_VERIFICATION_ENABLED =
  import.meta.env.VITE_EMAIL_VERIFICATION_ENABLED === "true";

// These are proposed API paths.
// Confirm them with the backend developer before enabling.
const endpoints = {
  verify: "/api/auth/verify-email",
  resend: "/api/auth/resend-verification",
};

export async function verifyEmail(token) {
  if (!EMAIL_VERIFICATION_ENABLED) {
    throw new Error("Email verification is not enabled yet.");
  }

  if (!token || typeof token !== "string") {
    throw new Error("Verification token is missing.");
  }

  const response = await api.post(endpoints.verify, {
    token,
  });

  return response.data;
}

export async function resendVerification(email) {
  if (!EMAIL_VERIFICATION_ENABLED) {
    throw new Error("Email verification is not enabled yet.");
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail) {
    throw new Error("Email address is required.");
  }

  const response = await api.post(endpoints.resend, {
    email: normalizedEmail,
  });

  return response.data;
}
