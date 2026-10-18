
import api from "./api";

export async function loginPatient(email, password) {
  const response = await api.post("/api/auth/login", {
    email: String(email).trim().toLowerCase(),
    password,
  });

  const result = response.data;

  // The backend may return { user: {...} }
  // or the user object directly.
  const user = result?.user ?? result;

  if (!user?.id || !user?.email || !user?.role) {
    throw new Error(
      "Invalid login response from the server."
    );
  }

  return user;
}

export function logoutPatient() {
  // No JWT, cookies, or stored login session.
  // React AppContext clears the user from memory.
}
