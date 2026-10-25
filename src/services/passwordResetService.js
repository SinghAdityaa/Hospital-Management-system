import api from "./api";

// Change paths / field names here if they differ in Swagger
const ENDPOINTS = {
  forgot: "/api/auth/forgot-password",
  reset: "/api/auth/reset-password",
};

const FIELDS = {
  email: "email",
  token: "token",
  newPassword: "newPassword",
  confirmPassword: "confirmPassword", // set to null if backend doesn't take it
};

export async function forgotPassword(email) {
  const normalizedEmail = String(email || "").trim().toLowerCase();

  if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
    throw new Error("Enter a valid email address.");
  }

  const { data } = await api.post(ENDPOINTS.forgot, {
    [FIELDS.email]: normalizedEmail,
  });

  return data;
}

export async function resetPassword(token, newPassword, confirmPassword) {
  if (!token || typeof token !== "string") {
    throw new Error("Reset token is missing.");
  }

  const body = {
    [FIELDS.token]: token,
    [FIELDS.newPassword]: newPassword,
  };

  if (FIELDS.confirmPassword) {
    body[FIELDS.confirmPassword] = confirmPassword;
  }

  const { data } = await api.post(ENDPOINTS.reset, body);
  return data;
}