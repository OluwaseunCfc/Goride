import { createContext, useState, useEffect, useCallback, useMemo } from "react";
import {
  ACCESS_TOKEN_KEY,
  USER_KEY,
  AUTH_LOGOUT_EVENT,
  getStoredAuth,
  setStoredAuth,
  clearStoredAuth,
  isDriverUser,
} from "../utils/authStorage";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  /**
   * Read localStorage during the very first render instead of inside an
   * effect. Effects run *after* children render, so with the old code
   * ProtectedRoute saw isAuthenticated === false on a reload and bounced
   * the user to /login before the session was ever restored.
   * localStorage is synchronous, so there is no reason to wait.
   */
  const [user, setUser] = useState(() => getStoredAuth().user);

  useEffect(() => {
    // The api layer fires this when a refresh token is dead or missing.
    const handleForcedLogout = () => setUser(null);

    // Keeps other tabs in sync: logging out in one tab logs out the rest.
    const handleStorage = (event) => {
      if (
        event.key === null ||
        event.key === ACCESS_TOKEN_KEY ||
        event.key === USER_KEY
      ) {
        setUser(getStoredAuth().user);
      }
    };

    window.addEventListener(AUTH_LOGOUT_EVENT, handleForcedLogout);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(AUTH_LOGOUT_EVENT, handleForcedLogout);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const login = useCallback((nextUser, tokens) => {
    // Tokens are optional: loginUser() already persisted them, but
    // accepting them here keeps this usable on its own.
    setStoredAuth({
      access: tokens?.access,
      refresh: tokens?.refresh,
      user: nextUser,
    });
    setUser(nextUser);
  }, []);

  const logout = useCallback(() => {
    clearStoredAuth();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isDriver: user ? isDriverUser(user) : null,
      login,
      logout,
    }),
    [user, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
