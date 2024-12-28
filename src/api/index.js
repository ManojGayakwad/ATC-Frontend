import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const api = {
  getBeverages: () => axios.get(`${API_URL}/beverages`),
  getResources: () => axios.get(`${API_URL}/resources`),
  createOrder: (orderData) => axios.post(`${API_URL}/orders`, orderData),
  updateResource: (id, data) => axios.patch(`${API_URL}/resources/${id}`, data),
  updateOrderStatus: (id, statusData) => axios.patch(`${API_URL}/orders/${id}`, statusData), // Add this
};
