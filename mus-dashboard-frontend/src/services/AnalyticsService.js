import axios from "axios";

const BASE_URL = "http://localhost:5000/api/analytics";

export const getAnalyticsOverview = () => axios.get(`${BASE_URL}/overview`);
export const getAnalyticsRevenue = () => axios.get(`${BASE_URL}/revenue`);
export const getAnalyticsOrderStatus = () =>
  axios.get(`${BASE_URL}/order-status`);
export const getAnalyticsCustomers = () =>
  axios.get(`${BASE_URL}/customers`);
export const getAnalyticsTopProducts = () =>
  axios.get(`${BASE_URL}/top-products`);
