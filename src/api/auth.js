import api from "./axios";
import { setStoredAuth, clearStoredAuth } from "../utils/authStorage";

// Register User
export function registerUser(data) {
  return api.post("register/", data);
}

// Login User
export async function loginUser(email, password) {
  const response = await api.post("login/", {
    email,
    password,
  });

  const { access, refresh, user } = response.data;

  setStoredAuth({ access, refresh, user });

  return response.data;
}

// Logout User
export function logoutUser() {
  clearStoredAuth();
}
