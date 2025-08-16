import { create } from "zustand";
import { loginUser, registerUser } from "../services/authServices";
import type { User, LoginCredentials, RegisterData } from "../types"; // Import all our types

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  // Update the function signatures to use our specific types
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const data = await loginUser(credentials);
      set({ token: data.token, isAuthenticated: true, isLoading: false });
      // In a real app, you would now decode the token to get user info and set it
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Login failed",
        isLoading: false,
      });
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      await registerUser(userData);
      set({ isLoading: false });
      // You could add logic here to automatically log the user in after registration
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Registration failed",
        isLoading: false,
      });
    }
  },

  logout: () => {
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
