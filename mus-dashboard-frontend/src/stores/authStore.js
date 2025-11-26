// src/stores/authStore.js
import { defineStore } from "pinia";
import api from "../services/api";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: localStorage.getItem("token") || "",
    loading: false,
    lastError: "",
  }),

  actions: {
    async login(username, password) {
      this.loading = true;
      this.lastError = "";

      try {
        const { data } = await api.post("/auth/login", {
          username,
          password,
        });

        this.user = data.user;
        this.token = data.token;

        localStorage.setItem("token", data.token);

        api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

        return true;
      } catch (err) {
        this.lastError =
          err.response?.data?.message ||
          err.message ||
          "Login gagal.";

        return false;
      } finally {
        this.loading = false;
      }
    },

    async fetchMe() {
      if (!this.token) return false;

      try {
        const { data } = await api.get("/auth/me");
        this.user = data;
        return true;
      } catch (err) {
        this.logout();
        return false;
      }
    },

    logout() {
      this.user = null;
      this.token = "";
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];
    },
  },
});
