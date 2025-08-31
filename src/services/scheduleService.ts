import api from "./api";

/**
 * Fetches the schedule for the next 3 days from the backend.
 */
export const getSchedule = async () => {
  const response = await api.get("/schedule");
  return response.data;
};

/**
 * Sends a request to book a specific slot for the logged-in performer.
 * @param slotId The ID of the slot to book.
 */
export const bookSlot = async (slotId: string) => {
  const response = await api.post(`/schedule/book/${slotId}`);
  return response.data;
};

/**
 * Sends a request to cancel a specific booking for the logged-in performer.
 * @param slotId The ID of the slot to cancel.
 */
export const cancelBooking = async (slotId: string) => {
  const response = await api.delete(`/schedule/cancel/${slotId}`);
  return response.data;
};
