// src/stores/authStore.js
import { defineStore } from "pinia";
import api from "../services/api"; // ini yang export default axios.create({ baseURL: API_BASE_URL })

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: localStorage.getItem("mus_token") || "",
    loading: false,
    lastError: "",
  }),

  actions: {
    async login(username, password) {
      this.loading = true;
      this.lastError = "";

      try {
        // PENTING: key-nya harus "username" dan "password"
        const { data } = await api.post("/auth/login", {
          username,
          password,
        });

        this.user = data.user;
        this.token = data.token;

        // set header default untuk request berikutnya
        api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        localStorage.setItem("mus_token", data.token);

        return true;
      } catch (err) {
        console.error("Login error:", err?.response?.data || err.message);
        this.lastError =
          err?.response?.data?.message || "Login gagal. Coba lagi.";
        return false;
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.user = null;
      this.token = "";
      this.lastError = "";
      localStorage.removeItem("mus_token");
      delete api.defaults.headers.common["Authorization"];
    },
  },
});
x 