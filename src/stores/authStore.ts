import { create } from "zustand";
import { loginUser, registerUser } from "../services/authServices";
import { getUserProfile, updateUserProfile } from "../services/userService"; // Import the new function
import type { User, LoginCredentials, RegisterData } from "../types";

interface AuthState {
  user: User | null; // This will now hold the full user profile
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthChecked: boolean;
  error: string | null;
  fetchUserProfile: () => Promise<void>; // New action
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem("authToken"),
  isAuthenticated: !!localStorage.getItem("authToken"),
  isLoading: false,
  isAuthChecked: false,
  error: null,

  fetchUserProfile: async () => {
    try {
      const userData = await getUserProfile();
      set({ user: userData });
    } catch (error) {
      console.error("Failed to fetch user profile", error);
      // If fetching fails (e.g., token expired), log the user out
      get().logout();
    }
  },

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const data = await loginUser(credentials);
      const token = data.token.split(" ")[1];
      localStorage.setItem("authToken", token);
      set({ token, isAuthenticated: true, isLoading: false });

      // After logging in, fetch the user's profile
      await get().fetchUserProfile();
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
    set({ user: null, token: null, isAuthenticated: false });
  },

  checkAuth: () => {
    try {
      const token = localStorage.getItem("authToken");
      if (token) {
        set({ token, isAuthenticated: true });
        // If a token exists on load, fetch the user profile
        get().fetchUserProfile();
      }
    } finally {
      set({ isAuthChecked: true });
    }
  },

  updateProfile: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const updatedUser = await updateUserProfile(userData);
      set({ user: updatedUser, isLoading: false });
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to update profile.";
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },
}));
