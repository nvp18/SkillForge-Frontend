// src/apiClient.js
import axios from 'axios';
import config from './config';

const apiClient = axios.create({
  baseURL: config.SPRING_API_BASE_URL,
});

// // Add a request interceptor to include the token
// apiClient.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });


export default apiClient;
