// mus-dashboard-frontend/src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "/.netlify/functions/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Inject token hanya saat di browser
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
