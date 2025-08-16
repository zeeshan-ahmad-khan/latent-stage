import { create } from "zustand";
import { loginUser, registerUser } from "../services/authServices";
import type { User, LoginCredentials, RegisterData } from "../types";

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthChecked: boolean; // New state to track initial check
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
    // ... (login logic remains the same)
    set({ isLoading: true, error: null });
    try {
      const data = await loginUser(credentials);
      const token = data.token.startsWith("Bearer ")
        ? data.token.split(" ")[1]
        : data.token;
      localStorage.setItem("authToken", token);
      set({ token, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Login failed",
        isLoading: false,
      });
    }
  },

  register: async (userData) => {
    // ... (register logic remains the same)
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
        // Here you would typically verify the token's expiry
        set({ token, isAuthenticated: true });
      }
    } finally {
      // This will run whether a token was found or not
      set({ isAuthChecked: true });
    }
  },
}));
