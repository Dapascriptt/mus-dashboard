import { defineStore } from "pinia";
import axios from "axios";

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
        const { data } = await axios.get("http://localhost:5000/api/analytics/overview");
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
        const { data } = await axios.get("http://localhost:5000/api/analytics/revenue");
        this.revenueByDay = data;
      } catch (err) {
        console.error(err);
      }
    },

    async fetchOrderStatus() {
      try {
        const { data } = await axios.get("http://localhost:5000/api/analytics/order-status");
        this.orderStatus = data;
      } catch (err) {
        console.error(err);
      }
    },

    async fetchRevenueByStatus() {
      try {
        const { data } = await axios.get("http://localhost:5000/api/analytics/customers");
        this.revenueByStatus = data;
      } catch (err) {
        console.error(err);
      }
    },

    async fetchTopProducts() {
      try {
        const { data } = await axios.get("http://localhost:5000/api/analytics/top-products");
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
