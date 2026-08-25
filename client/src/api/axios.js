import axios from 'axios';

// Exported for OAuth links (plain <a href> redirects, not axios calls)
export const API_BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // send httpOnly cookie with every request
  timeout: 20000, // never hang forever if the server is down/restarting —
  // without this a stuck TCP connection leaves spinners (e.g. "Creating
  // account...") disabled indefinitely with no error shown to the user.
});

/**
 * Single-flight session refresh (race-condition safe).
 * Multiple parallel 401s share ONE /auth/refresh call via this promise;
 * the queue releases only after the refresh settles (success OR failure).
 */
let refreshPromise = null;

const refreshSession = () => {
  if (!refreshPromise) {
    refreshPromise = axios
      .post(
        `${API_BASE}/auth/refresh`,
        {},
        { withCredentials: true, timeout: 15000 }
      )
      .then(() => true)
      .catch(() => false)
      .finally(() => {
        // Release the queue so future 401s can trigger a fresh cycle
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

// Response interceptor — network-error normalization + 401 auto-refresh
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    const status = err.response?.status;
    const url = original?.url || '';

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
      return Promise.reject(err);
    }

    // Endpoints where a 401 is EXPECTED (wrong password, unverified OTP...)
    // must never trigger a refresh or a forced logout.
    const isAuthFlow =
      url.includes('/auth/login') ||
      url.includes('/auth/signup') ||
      url.includes('/auth/verify-otp') ||
      url.includes('/auth/resend-otp') ||
      url.includes('/auth/refresh');

    // 401 on a protected route → one silent refresh attempt, then retry.
    // original._retried guards against infinite retry loops.
    if (status === 401 && !isAuthFlow && original && !original._retried) {
      original._retried = true;
      const refreshed = await refreshSession();

      if (refreshed) {
        return api(original); // retry with the fresh session cookie
      }

      // Refresh also failed — session is truly dead. Force logout.
      window.dispatchEvent(new Event('auth:logout'));
      err.response.data = {
        ...err.response.data,
        message: 'Session expired. Please login again.',
      };
      return Promise.reject(err);
    }

    // 401 on non-login protected calls without retry (e.g. refresh was
    // already attempted elsewhere) — keep the session clean.
    if (status === 401 && !isAuthFlow) {
      window.dispatchEvent(new Event('auth:logout'));
    }

    return Promise.reject(err);
  }
);

export default api;