// src/stores/orderStore.js
import { defineStore } from "pinia";
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
} from "../services/OrderService";

export const useOrderStore = defineStore("order", {
  state: () => ({
    orders: [],
    currentOrder: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchOrders() {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await getOrders();
        this.orders = data;
      } catch (err) {
        console.error(err);
        this.error = "Gagal mengambil data orders";
      } finally {
        this.loading = false;
      }
    },

    async fetchOrderById(id) {
      this.loading = true;
      this.error = null;
      this.currentOrder = null;

      try {
        const { data } = await getOrderById(id);
        // kalau backend balas JSON order, data langsung disimpan
        this.currentOrder = data;
      } catch (err) {
        console.error(err);
        this.error = "Order tidak ditemukan";
      } finally {
        this.loading = false;
      }
    },

    async createOrderAction(payload) {
      this.error = null;
      try {
        const { data } = await createOrder(payload);
        this.orders.unshift(data);
      } catch (err) {
        console.error(err);
        this.error = "Gagal membuat order";
      }
    },

    async changeOrderStatus(id, status) {
      this.error = null;
      try {
        const { data } = await updateOrderStatus(id, status);

        // update currentOrder di detail
        if (this.currentOrder && this.currentOrder._id === id) {
          this.currentOrder.status = data.status;
        }

        // update list order di OrderList
        const idx = this.orders.findIndex((o) => o._id === id);
        if (idx !== -1) {
          this.orders[idx].status = data.status;
        }

        return data;
      } catch (err) {
        console.error(err);
        this.error = "Gagal mengupdate status order";
        throw err;
      }
    },
  },
});
