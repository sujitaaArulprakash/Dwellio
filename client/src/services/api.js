import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Attach JWT token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('dwellio_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Normalize errors and handle 401 unauthenticated
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected server error occurred. Please try again.';

    // If 401 token invalid/expired, clear local storage
    if (error.response?.status === 401) {
      if (localStorage.getItem('dwellio_token')) {
        localStorage.removeItem('dwellio_token');
        localStorage.removeItem('dwellio_user');
        // Let application context handle redirect cleanly without hard reload
      }
    }

    return Promise.reject(new Error(message));
  }
);

export default api;
