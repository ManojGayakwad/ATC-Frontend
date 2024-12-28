import axios from "axios";

const API = axios.create({
  baseURL: "https://anytime-chai-backend.vercel.app/api",
  withCredentials: true, // Enable cookies or authentication headers if required
  headers: {
    "Content-Type": "application/json", // Ensure JSON content type
  },
});

export const api = {
  getBeverages: () => API.get("/beverages"),
  getResources: () => API.get("/resources"),
  createOrder: (orderData) => API.post("/orders", orderData),
  updateResource: (id, data) => API.patch(`/resources/${id}`, data),
  updateOrderStatus: (id, statusData) => API.patch(`/orders/${id}`, statusData), // Add this
};
