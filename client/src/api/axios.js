import axios from 'axios';

// Exported for OAuth links (plain <a href> redirects, not axios calls)
export const API_BASE = import.meta.env.VITE_API_URL || '/api';

/* ── Token storage (localStorage) ─────────────────────────────────────
   Cookies alone broke on cross-site deploys: browsers (Chrome 3rd-party
   cookie phase-out, Safari ITP, Brave, Firefox strict) silently drop
   Set-Cookie headers from cross-origin XHR responses. So the server now
   ALSO returns both tokens in the response body, and we attach them via
   Authorization: Bearer headers. Cookies keep working as a fallback on
   same-origin deployments. ────────────────────────────────────────────*/
const ACCESS_KEY = 'accessToken';
const REFRESH_KEY = 'refreshToken';

export const getAccessToken = () => localStorage.getItem(ACCESS_KEY);
export const getRefreshToken = () => localStorage.getItem(REFRESH_KEY);

export const setAuthTokens = (access, refresh) => {
  if (access) localStorage.setItem(ACCESS_KEY, access);
  if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
};

export const clearAuthTokens = () => {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
};

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // cookies still work on same-origin deployments
  timeout: 20000,
});

// Attach the Bearer token to every request when we have one
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Persist tokens from auth responses (login / verify-otp / refresh / OAuth)
const saveTokensFromResponse = (res) => {
  const { accessToken, refreshToken } = res.data?.data || {};
  if (accessToken || refreshToken) setAuthTokens(accessToken, refreshToken);
};

/**
 * Single-flight session refresh (race-condition safe).
 * Multiple parallel 401s share ONE /auth/refresh call via this promise.
 * Sends the refresh token in the BODY (works even when cookies are
 * blocked) — the server accepts cookie OR body.
 */
let refreshPromise = null;

const refreshSession = () => {
  if (!refreshPromise) {
    refreshPromise = axios
      .post(
        `${API_BASE}/auth/refresh`,
        { refreshToken: getRefreshToken() },
        { withCredentials: true, timeout: 15000 }
      )
      .then((res) => {
        // Rotation: the server returns a NEW refresh token — store both
        const { accessToken, refreshToken } = res.data?.data || {};
        if (accessToken) setAuthTokens(accessToken, refreshToken);
        return true;
      })
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

// Response interceptor — token capture + network normalization + 401 refresh
api.interceptors.response.use(
  (res) => {
    saveTokensFromResponse(res);
    return res;
  },
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
        return api(original); // retry — request interceptor adds the NEW token
      }

      // Refresh also failed — session is truly dead. Force logout.
      clearAuthTokens();
      window.dispatchEvent(new Event('auth:logout'));
      err.response.data = {
        ...err.response.data,
        message: 'Session expired. Please login again.',
      };
      return Promise.reject(err);
    }

    // 401 on non-login protected calls without retry — keep session clean.
    if (status === 401 && !isAuthFlow) {
      clearAuthTokens();
      window.dispatchEvent(new Event('auth:logout'));
    }

    return Promise.reject(err);
  }
);

export default api;