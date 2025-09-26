import api from "./api";

export const getAddresses = () => api.get("/address");
export const addAddress = (data) => api.post("/address", data);
export const updateAddress = (id, data) => api.put(`/address/${id}`, data);
export const deleteAddress = (id) => api.delete(`/address/${id}`);
