import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/v1", // change to your backend URL
  withCredentials: true, // if you’re using cookies
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // get token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // attach token
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
