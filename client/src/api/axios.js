import axios from 'axios';

const api = axios.create({
  // Dev: Vite proxies /api to localhost:5000.
  // Prod: set VITE_API_URL in the environment (e.g., https://your-api.onrender.com/api)
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true, // send httpOnly cookie with every request
  timeout: 20000, // never hang forever if the server is down/restarting —
  // without this a stuck TCP connection leaves spinners (e.g. "Creating
  // account...") disabled indefinitely with no error shown to the user.
});

// Response interceptor — auto-logout on expired/invalid session
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Network failure or timeout (server down / restarting): axios gives no
    // response object at all. Normalize it so every thunk's
    // `err.response?.data?.message` shows a clear, human-friendly error.
    if (!err.response) {
      err.response = {
        status: 0,
        data: {
          message:
            err.code === 'ECONNABORTED'
              ? 'Request timed out — please try again'
              : 'Cannot reach the server — is the backend running?',
        },
      };
    }
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