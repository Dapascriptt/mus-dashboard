import axios from "axios";

const envBase = import.meta.env.VITE_API_URL?.trim();
const isBrowser = typeof window !== "undefined";
const isLocalhost =
  isBrowser && ["localhost", "127.0.0.1"].includes(window.location.hostname);
const envLooksLocalhost = /localhost|127\.0\.0\.1/i.test(envBase || "");

// Di Netlify (bukan localhost), abaikan VITE_API_URL jika mengarah ke localhost
// supaya front-end tidak menembak host yang salah. Default tetap "/api" agar
// mengikuti redirect Netlify Functions.
const API_BASE_URL = envBase && (isLocalhost || !envLooksLocalhost)
  ? envBase
  : "/api";

if (envBase && envLooksLocalhost && !isLocalhost) {
  // Membantu debug jika ada env Netlify yang masih mengarah ke localhost
  console.warn(
    `[mus-dashboard] VITE_API_URL (${envBase}) diabaikan karena tidak bisa diakses ` +
      "dari deploy; memakai '/api' sebagai gantinya"
  );
}

const api = axios.create({
  baseURL: API_BASE_URL,
});

export { API_BASE_URL };
export default api;
