import api from "./api";

export const getOrders = () => api.get("/order");
export const getOrderById = (id) => api.get(`/order/${id}`);
export const addOrder = (data) => api.post("/order", data);
export const updateOrder = (id, data) => api.put(`/order/${id}`, data);
export const deleteOrder = (id) => api.delete(`/order/${id}`);
