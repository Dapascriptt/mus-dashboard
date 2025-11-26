import { defineStore } from "pinia";
import api from "../services/api";

export const useAnalyticsStore = defineStore("analytics", {
  state: () => ({
    loading: false,
    error: "",
    overview: {
      totalOrders: 0,
      totalRevenue: 0,
      totalProducts: 0,
      totalCustomers: 0,
    },
    revenueByDay: [],      // /analytics/revenue
    orderStatus: [],       // /analytics/order-status
    revenueByStatus: [],   // /analytics/customers
    topProducts: [],       // /analytics/top-products
  }),

  actions: {
    async fetchOverview() {
      this.loading = true;
      this.error = "";
      try {
        const { data } = await api.get("/analytics/overview");
        this.overview = data;
      } catch (err) {
        console.error(err);
        this.error = "Gagal mengambil overview analytics";
      } finally {
        this.loading = false;
      }
    },

    async fetchRevenue() {
      try {
        const { data } = await api.get("/analytics/revenue");
        this.revenueByDay = data;
      } catch (err) {
        console.error(err);
      }
    },

    async fetchOrderStatus() {
      try {
        const { data } = await api.get("/analytics/order-status");
        this.orderStatus = data;
      } catch (err) {
        console.error(err);
      }
    },

    async fetchRevenueByStatus() {
      try {
        const { data } = await api.get("/analytics/customers");
        this.revenueByStatus = data;
      } catch (err) {
        console.error(err);
      }
    },

    async fetchTopProducts() {
      try {
        const { data } = await api.get("/analytics/top-products");
        this.topProducts = data;
      } catch (err) {
        console.error(err);
      }
    },

    async fetchAll() {
      await Promise.all([
        this.fetchOverview(),
        this.fetchRevenue(),
        this.fetchOrderStatus(),
        this.fetchRevenueByStatus(),
        this.fetchTopProducts(),
      ]);
    },
  },
});
