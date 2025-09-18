import type { User } from "../types";
import api from "./api";

export const getUserProfile = async () => {
  const response = await api.get("/users/profile");
  return response.data;
};

export const getUserBookings = async (page = 1) => {
  // Pass the page number as a query parameter
  const response = await api.get(`/users/bookings?page=${page}`);
  return response.data;
};

export const updateUserProfile = async (data: Partial<User>) => {
  const response = await api.put("/users/profile", data);
  return response.data;
};
