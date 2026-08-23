import axios from 'axios';

const api = axios.create({
  // Dev: Vite proxies /api to localhost:5000.
  // Prod: set VITE_API_URL in the environment (e.g., https://your-api.onrender.com/api)
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true, // send httpOnly cookie with every request
});

// Response interceptor — auto-logout on expired/invalid session
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // Only force logout if we were trying an authenticated route
      const isAuthRoute = err.config?.url?.includes('/auth/login') ||
        err.config?.url?.includes('/auth/signup');
      if (!isAuthRoute) {
        window.dispatchEvent(new Event('auth:logout'));
      }
    }
    return Promise.reject(err);
  }
);

export default api;