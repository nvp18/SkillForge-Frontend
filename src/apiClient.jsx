// src/apiClient.js
import axios from 'axios';
import config from './config';

const apiClient = axios.create({
  baseURL: config.SPRING_API_BASE_URL,
});

export default apiClient;
