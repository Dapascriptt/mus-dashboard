// src/stores/productStore.js
import { defineStore } from "pinia";
import api from "../services/api";
import {
  getProducts,
  deleteProduct as apiDeleteProduct
} from "../services/ProductService";


export const useProductStore = defineStore("products", {
  state: () => ({
    products: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchProducts() {
      this.loading = true;
      this.error = null;

      try {
        const res = await getProducts();
        this.products = res.data;
      } catch (err) {
        console.error(err);
        this.error = "Gagal memuat data produk";
      } finally {
        this.loading = false;
      }
    },

    async deleteProduct(id) {
      try {
        await apiDeleteProduct(id);

        // buang dari state lokal
        this.products = this.products.filter((p) => p._id !== id);
      } catch (err) {
        console.error("Delete error:", err.response?.data || err.message);
        throw err;
      }
    },
  },
});