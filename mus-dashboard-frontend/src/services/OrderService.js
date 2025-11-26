// src/services/orderService.js
import api from "./api";

const API_URL = "/orders";

// GET semua order
export const getOrders = () => api.get(API_URL);

// GET order by ID
export const getOrderById = (id) => api.get(`${API_URL}/${id}`);

// POST buat order baru (kalau nanti kepakai)
export const createOrder = (data) => api.post(API_URL, data);

// PUT update status order
export const updateOrderStatus = (id, status) =>
  api.put(`${API_URL}/${id}`, { status });

// DELETE order
export const deleteOrder = (id) => api.delete(`${API_URL}/${id}`);
