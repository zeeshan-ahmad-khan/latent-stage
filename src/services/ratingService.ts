import api from "./api";

export const submitRating = async (slotId: string, score: number) => {
  const response = await api.post(`/ratings/${slotId}`, { score });
  return response.data;
};
