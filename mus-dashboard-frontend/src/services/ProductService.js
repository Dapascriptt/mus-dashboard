import api from "./api";

const API_URL = "/products";

export const getProducts = () => api.get(API_URL);

export const getProductById = (id) => api.get(`${API_URL}/${id}`);

export const createProduct = (data) => api.post(API_URL, data);

export const updateProduct = (id, data) =>
  api.put(`${API_URL}/${id}`, data);

export const deleteProduct = (id) =>
  api.delete(`${API_URL}/${id}`);
