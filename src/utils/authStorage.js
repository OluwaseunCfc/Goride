// Single source of truth for how auth data is persisted.
// Kept in one place so the context, the api layer and the axios
// interceptors can never disagree about key names or shapes.

export const ACCESS_TOKEN_KEY = "access_token";
export const REFRESH_TOKEN_KEY = "refresh_token";
export const USER_KEY = "user";

// Dispatched when the api layer discovers the session is dead, so React
// can clear its state without a full page reload.
export const AUTH_LOGOUT_EVENT = "auth:logout";

/**
 * localStorage can hold malformed JSON (a half-written value, the literal
 * string "undefined", data from an older version of the app). JSON.parse
 * throws on all of those, which would crash the AuthProvider on boot.
 */
export function safeParseJSON(raw) {
  if (!raw || raw === "undefined" || raw === "null") return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getStoredUser() {
  return safeParseJSON(localStorage.getItem(USER_KEY));
}

/** A session is only valid when we have both a token and a user. */
export function getStoredAuth() {
  const token = getAccessToken();
  const user = getStoredUser();

  if (!token || !user) return { token: null, user: null };

  return { token, user };
}

export function setStoredAuth({ access, refresh, user }) {
  if (access) localStorage.setItem(ACCESS_TOKEN_KEY, access);
  if (refresh) localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function setAccessToken(access) {
  localStorage.setItem(ACCESS_TOKEN_KEY, access);
}

/**
 * Removes only the auth keys. The previous implementation called
 * localStorage.clear(), which also wiped unrelated app data.
 */
export function clearStoredAuth() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function notifyLogout() {
  window.dispatchEvent(new Event(AUTH_LOGOUT_EVENT));
}

/** Backend may send is_driver as a real boolean or as a string. */
export function isDriverUser(user) {
  return user?.is_driver === true || user?.is_driver === "true";
}
