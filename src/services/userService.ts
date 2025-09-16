import api from "./api";

export const getUserProfile = async () => {
  const response = await api.get("/users/profile");
  return response.data;
};

export const getUserBookings = async () => {
  const response = await api.get("/users/bookings");
  return response.data;
};
