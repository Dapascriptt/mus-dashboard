import axios from "axios";

const envBase = import.meta.env.VITE_API_URL?.trim();
const isBrowser = typeof window !== "undefined";
const isLocalhost =
  isBrowser && ["localhost", "127.0.0.1"].includes(window.location.hostname);

let API_BASE_URL;

// 1. Kalau ada VITE_API_URL, selalu pakai itu
if (envBase) {
  API_BASE_URL = envBase;
} else if (isLocalhost) {
  // 2. Di localhost, pakai /api (atau bisa kamu ganti ke http://localhost:5000/api)
  API_BASE_URL = "/api";
} else {
  // 3. Di Netlify / production, langsung tembak Netlify Function
  API_BASE_URL = "/.netlify/functions/api";
}

const api = axios.create({
  baseURL: API_BASE_URL,
});

export { API_BASE_URL };
export default api;
