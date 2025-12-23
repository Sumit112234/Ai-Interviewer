// src/axiosConfig.js
import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_APP_BACKEND_URL, // From backend
  withCredentials: true, // Allow cookies if backend uses them
});

export default instance;