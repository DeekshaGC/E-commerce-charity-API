import api from "./api";

export const getCharities = () => api.get("/charity");
export const addCharity = (data) => api.post("/charity", data);
export const updateCharity = (id, data) => api.put(`/charity/${id}`, data);
export const deleteCharity = (id) => api.delete(`/charity/${id}`);
