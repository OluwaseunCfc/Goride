import axiosInstance from "axios";
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  clearStoredAuth,
  notifyLogout,
} from "../utils/authStorage";

// Trailing slashes on the env value would produce URLs like
// "http://127.0.0.1:8000//token/refresh/", which 404s and used to be
// mistaken for an expired session.
const RAW_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/";
const BASE_URL = RAW_BASE_URL.replace(/\/+$/, "");

const api = axiosInstance.create({
  baseURL: `${BASE_URL}/`,
});

// Endpoints that must never carry an Authorization header and must never
// trigger the "refresh then retry" flow.
const AUTH_ENDPOINTS = ["login/", "register/", "token/refresh/"];

function isAuthEndpoint(url = "") {
  const path = url.replace(BASE_URL, "").replace(/^\/+/, "");
  return AUTH_ENDPOINTS.some((endpoint) => path.startsWith(endpoint));
}

api.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token && !isAuthEndpoint(config.url)) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Automatically refresh expired access tokens.
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    const shouldAttemptRefresh =
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      // A 401 from the login endpoint means "wrong password", not
      // "expired session". Refreshing there used to wipe a perfectly
      // good session whenever a sign-in attempt failed.
      !isAuthEndpoint(originalRequest.url);

    if (!shouldAttemptRefresh) {
      return Promise.reject(error);
    }

    const refreshToken = getRefreshToken();

    // With no refresh token there is nothing to try; don't send a
    // request with `refresh: null` just to be rejected.
    if (!refreshToken) {
      clearStoredAuth();
      notifyLogout();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const response = await axiosInstance.post(
        `${BASE_URL}/token/refresh/`,
        { refresh: refreshToken }
      );

      setAccessToken(response.data.access);

      originalRequest.headers.Authorization = `Bearer ${response.data.access}`;

      return api(originalRequest);
    } catch (refreshError) {
      // The session really is gone. Clear it and let the app react.
      // Note: no `window.location.href` here — a hard navigation reloads
      // the whole SPA and throws away React state. ProtectedRoute will
      // redirect to /login on its own once the context updates.
      clearStoredAuth();
      notifyLogout();

      return Promise.reject(refreshError);
    }
  }
);

export default api;
