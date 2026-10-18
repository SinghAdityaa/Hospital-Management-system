
import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "https://appoint-api-mc4u.onrender.com/medicare",
  timeout: 90000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
