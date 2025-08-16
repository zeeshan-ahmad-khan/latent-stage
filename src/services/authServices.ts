import api from "./api";
import { type LoginCredentials, type RegisterData } from "../types"; // Import our new types

export const loginUser = async (credentials: LoginCredentials) => {
  // The 'credentials' parameter is now strongly typed
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

export const registerUser = async (userData: RegisterData) => {
  // The 'userData' parameter is now strongly typed
  const response = await api.post("/auth/register", userData);
  return response.data;
};
