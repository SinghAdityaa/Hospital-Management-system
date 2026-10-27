import api from "./api";
import { clearSession } from "./tokenStorage";

export async function loginPatient(email, password) {
  const response = await api.post("/api/auth/login", {
    email: String(email).trim().toLowerCase(),
    password,
  });

  const result = response.data;

  // Backend returns { token, user: {...} }
  const user = result?.user ?? result;
  const token = result?.token ?? result?.accessToken;

  if (!user?.id || !user?.email || !user?.role) {
    throw new Error("Invalid login response from the server.");
  }

  if (!token) {
    throw new Error("Login response did not include a token.");
  }

  return { token, user };
}

// Used after a page refresh to confirm the saved token is still valid
export async function fetchCurrentUser() {
  const { data } = await api.get("/api/auth/me");
  return data;
}

export function logoutPatient() {
  clearSession();
}