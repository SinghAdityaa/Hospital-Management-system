import api from "./api";

export const EMAIL_VERIFICATION_ENABLED =
  import.meta.env.VITE_EMAIL_VERIFICATION_ENABLED !== "false";

export async function verifyEmail(token) {
  if (!token || typeof token !== "string") {
    throw new Error("Verification token is missing.");
  }

  const { data } = await api.post(
    "/api/auth/verify-email",
    { token }
  );

  return data;
}

export async function resendVerification(email) {
  const normalizedEmail = String(email || "")
    .trim()
    .toLowerCase();

  if (
    !/^[A-Za-z0-9._%+-]+@gmail\.com$/i.test(
      normalizedEmail
    )
  ) {
    throw new Error(
      "Enter a valid registered Gmail address."
    );
  }

  const { data } = await api.post(
    "/api/auth/resend-verification",
    {
      email: normalizedEmail,
    }
  );

  return data;
}