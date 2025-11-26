import api from "./api";

const BASE_URL = "/analytics";

export const getAnalyticsOverview = () => api.get(`${BASE_URL}/overview`);
export const getAnalyticsRevenue = () => api.get(`${BASE_URL}/revenue`);
export const getAnalyticsOrderStatus = () =>
  api.get(`${BASE_URL}/order-status`);
export const getAnalyticsCustomers = () =>
  api.get(`${BASE_URL}/customers`);
export const getAnalyticsTopProducts = () =>
  api.get(`${BASE_URL}/top-products`);
