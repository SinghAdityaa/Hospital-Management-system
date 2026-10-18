
import api from "./api";

export async function loginPatient(email, password) {
  const response = await api.post("/api/auth/login", {
    email: email.trim().toLowerCase(),
    password,
  });

  const result = response.data;

  const user = result?.user ?? result;

  if (!user?.id || !user?.email || !user?.role) {
    throw new Error("Invalid login response from the server.");
  }

  return user;
}

export function logoutPatient() {
  
}
