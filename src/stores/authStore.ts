import { create } from "zustand";
import { loginUser, registerUser } from "../services/authServices";
import type { LoginCredentials, RegisterData } from "../types";

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthChecked: boolean; // Tracks if we have checked localStorage yet
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  isAuthenticated: false,
  isLoading: false,
  isAuthChecked: false, // Start as false
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const data = await loginUser(credentials);
      const token = data.token.startsWith("Bearer ")
        ? data.token.split(" ")[1]
        : data.token;

      // Save token to localStorage
      localStorage.setItem("authToken", token);

      set({ token, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Login failed",
        isLoading: false,
      });
      throw err; // Re-throw error to handle it in the component if needed
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      await registerUser(userData);
      const { login } = get();
      await login({
        loginIdentifier: userData.email,
        password: userData.password,
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Registration failed",
        isLoading: false,
      });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem("authToken");
    set({ token: null, isAuthenticated: false });
  },

  checkAuth: () => {
    try {
      const token = localStorage.getItem("authToken");
      if (token) {
        set({ token, isAuthenticated: true });
      }
    } finally {
      set({ isAuthChecked: true });
    }
  },
}));
