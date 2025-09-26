import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/v1", // change to your backend URL
  withCredentials: true, // if you’re using cookies
});

export default api;
