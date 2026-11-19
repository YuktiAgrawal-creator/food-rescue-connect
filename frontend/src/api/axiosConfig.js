import axios from 'axios';

// Priority:
// 1. Explicit environment variable: VITE_API_URL (configured on Vercel or in .env)
// 2. Production fallback: https://food-rescue-connect.onrender.com/api
// 3. Development fallback: http://localhost:8000/api
const baseURL = import.meta.env.VITE_API_URL || (import.meta.env.PROD
  ? 'https://food-rescue-connect.onrender.com/api'
  : 'http://localhost:8000/api');

const api = axios.create({
  baseURL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
