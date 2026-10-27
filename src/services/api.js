import axios from "axios";
import { getToken, clearSession } from "./tokenStorage";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "https://appoint-api-mc4u.onrender.com/medicare",

  timeout: 90000,

  headers: {
    "Content-Type": "application/json",
  },
});

// Endpoints that must NOT receive a token
const PUBLIC_PATHS = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/verify-email",
  "/api/auth/resend-verification",
  "/api/auth/forgot-password",
  "/api/auth/reset-password",
];

const isPublic = (url = "") =>
  PUBLIC_PATHS.some((path) => url.includes(path));

// Attach the JWT to every protected request
api.interceptors.request.use((config) => {
  const token = getToken();

  if (token && !isPublic(config.url)) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// If the token is expired or invalid, log the user out
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401 && !isPublic(error.config?.url)) {
      clearSession();
      window.dispatchEvent(new Event("auth:expired"));
    }

    return Promise.reject(error);
  }
);

export default api;