// utils/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_Login,
  timeout: 3000, // 3秒
});

export default axiosInstance;
