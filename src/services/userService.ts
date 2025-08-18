import api from "./api";

export const getUserProfile = async () => {
  // We no longer need to get the token or set the headers here.
  // The interceptor handles it for us automatically.
  const response = await api.get("/users/profile");
  return response.data;
};
