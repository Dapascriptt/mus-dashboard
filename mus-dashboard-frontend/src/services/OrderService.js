// src/services/orderService.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/orders";

// GET semua order
export const getOrders = () => axios.get(API_URL);

// GET order by ID
export const getOrderById = (id) => axios.get(`${API_URL}/${id}`);

// POST buat order baru (kalau nanti kepakai)
export const createOrder = (data) => axios.post(API_URL, data);

// PUT update status order
export const updateOrderStatus = (id, status) =>
  axios.put(`${API_URL}/${id}`, { status });

// DELETE order
export const deleteOrder = (id) => axios.delete(`${API_URL}/${id}`);
