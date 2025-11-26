import { defineStore } from "pinia";
import api from "../services/api";

export const useAuthStore = defineStore("authStore", {
  state: () => ({
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
    loading: false,
    lastError: "",
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    async login(username, password) {
      this.loading = true;
      this.lastError = "";
      try {
        const res = await api.post("/auth/login", {
          username,
          password,
        });

        this.user = res.data.user;
        this.token = res.data.token;

        localStorage.setItem("user", JSON.stringify(this.user));
        localStorage.setItem("token", this.token);

        return true;            // ✅ penting
      } catch (err) {
        const apiMessage = err.response?.data?.message;
        this.lastError = apiMessage || err.message || "Login gagal";
        console.error("Login failed:", err.response?.data || err.message);
        return false;           // ✅ biar bisa dideteksi di Login.vue
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
});
