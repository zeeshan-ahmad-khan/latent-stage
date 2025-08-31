import { create } from "zustand";
import {
  getSchedule,
  bookSlot,
  cancelBooking,
} from "../services/scheduleService";

// Define the shape of a single slot coming from the API
export interface Slot {
  _id: string;
  startTime: string; // Comes as an ISO string
  status: "available" | "booked";
  performer?: {
    _id: string;
    username: string;
  };
}

// Define the shape of our store's state
interface ScheduleState {
  todaySlots: Slot[];
  tomorrowSlots: Slot[];
  dayAfterTomorrowSlots: Slot[];
  isLoading: boolean;
  error: string | null;
  fetchSchedule: () => Promise<void>;
  bookSlot: (slotId: string) => Promise<void>;
  cancelBooking: (slotId: string) => Promise<void>;
}

export const useScheduleStore = create<ScheduleState>((set, get) => ({
  // --- STATE ---
  todaySlots: [],
  tomorrowSlots: [],
  dayAfterTomorrowSlots: [],
  isLoading: false,
  error: null,

  // --- ACTIONS ---
  fetchSchedule: async () => {
    set({ isLoading: true, error: null });
    try {
      const allSlots = await getSchedule();

      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);
      const dayAfter = new Date();
      dayAfter.setDate(today.getDate() + 2);

      const todaySlots: Slot[] = [];
      const tomorrowSlots: Slot[] = [];
      const dayAfterTomorrowSlots: Slot[] = [];

      allSlots.forEach((slot: Slot) => {
        const slotDate = new Date(slot.startTime);
        if (slotDate.toDateString() === today.toDateString()) {
          todaySlots.push(slot);
        } else if (slotDate.toDateString() === tomorrow.toDateString()) {
          tomorrowSlots.push(slot);
        } else if (slotDate.toDateString() === dayAfter.toDateString()) {
          dayAfterTomorrowSlots.push(slot);
        }
      });

      set({
        todaySlots,
        tomorrowSlots,
        dayAfterTomorrowSlots,
        isLoading: false,
      });
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch schedule.";
      set({ error: errorMessage, isLoading: false });
    }
  },

  bookSlot: async (slotId: string) => {
    try {
      await bookSlot(slotId);
      await get().fetchSchedule();
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to book slot.";
      throw new Error(errorMessage);
    }
  },

  cancelBooking: async (slotId: string) => {
    try {
      await cancelBooking(slotId);
      await get().fetchSchedule();
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to cancel booking.";
      throw new Error(errorMessage);
    }
  },
}));
