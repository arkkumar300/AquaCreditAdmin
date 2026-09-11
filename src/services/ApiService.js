// src/services/ApiService.js

import axios from 'axios';
import Joi from "joi";

export const initialAuthState = {
  userId: 4,
  userName: 'admin',
};

const ApiService = (() => {
  const axiosInstance = axios.create({
    baseURL:
    import.meta.env.VITE_API_BASE_URL || 'https://api.aquacredit.in/api/', // Replace with your API base URL
      // import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/', // Replace with your API base URL
    timeout: 10000, // Request timeout in milliseconds
  });

  // Interceptor for handling requests
  axiosInstance.interceptors.request.use((config) => {
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data'; // Set for FormData
    } else {
      config.headers['Content-Type'] = 'application/json'; // Default
    }
    return config;
  });

  // Interceptor for handling responses
  axiosInstance.interceptors.response.use(
    (response) => response.data,
    (error) => {
      console.error(
        'API error:', error.response.data
      );
      return Promise.reject(error.response || error.message);
    }
  );

  return {
    get: (url, params = {}, config = {}) =>
      axiosInstance.get(url, { params, ...config }),
  
    post: (url, data, config = {}) =>
      axiosInstance.post(url, data, config),
  
    put: (url, data, config = {}) =>
      axiosInstance.put(url, data, config),
  
    delete: (url, config = {}) =>
      axiosInstance.delete(url, config),
  };
})();

export default ApiService;
