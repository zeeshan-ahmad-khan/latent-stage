import { create } from "zustand";
import {
  getSchedule,
  bookSlot,
  cancelBooking,
} from "../services/scheduleService";

// Define the shape of a single slot coming from the API
export interface Slot {
  _id: string;
  startTime: string;
  status: "available" | "booked";
  performer?: {
    _id: string;
    username: string;
    // Add the other performer fields we need
    profilePictureUrl?: string;
    bio?: string;
    socialLinks?: {
      youtube?: string;
      instagram?: string;
      facebook?: string;
    };
  };
}

// Define the shape of our store's state
interface ScheduleState {
  allSlots: Slot[];
  todaySlots: Slot[];
  tomorrowSlots: Slot[];
  dayAfterTomorrowSlots: Slot[];
  livePerformer: Slot | null;
  nextUpPerformer: Slot | null;
  isLoading: boolean;
  error: string | null;
  fetchSchedule: () => Promise<void>;
  updateLiveStatus: () => void;
  bookSlot: (slotId: string) => Promise<void>;
  cancelBooking: (slotId: string) => Promise<void>;
}

const processSlots = (allSlots: Slot[]) => {
  const now = new Date();
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const dayAfter = new Date();
  dayAfter.setDate(today.getDate() + 2);

  const todaySlots: Slot[] = [];
  const tomorrowSlots: Slot[] = [];
  const dayAfterTomorrowSlots: Slot[] = [];
  let currentLiveSlot: Slot | null = null;

  allSlots.forEach((slot: Slot) => {
    const slotDate = new Date(slot.startTime);
    // Only show slots that haven't ended yet
    const endTime = new Date(slot.startTime).getTime() + 15 * 60 * 1000;
    if (now.getTime() > endTime) return;

    if (slotDate.toDateString() === today.toDateString()) {
      todaySlots.push(slot);
      const startTime = new Date(slot.startTime).getTime();
      if (
        slot.status === "booked" &&
        now.getTime() >= startTime &&
        now.getTime() < endTime
      ) {
        currentLiveSlot = slot;
      }
    } else if (slotDate.toDateString() === tomorrow.toDateString()) {
      tomorrowSlots.push(slot);
    } else if (slotDate.toDateString() === dayAfter.toDateString()) {
      dayAfterTomorrowSlots.push(slot);
    }
  });

  let nextUpSlot: Slot | null = null;
  if (!currentLiveSlot) {
    nextUpSlot =
      allSlots.find(
        (slot) => slot.status === "booked" && new Date(slot.startTime) > now
      ) || null;
  }

  return {
    todaySlots,
    tomorrowSlots,
    dayAfterTomorrowSlots,
    livePerformer: currentLiveSlot,
    nextUpPerformer: nextUpSlot,
  };
};

export const useScheduleStore = create<ScheduleState>((set, get) => ({
  allSlots: [],
  todaySlots: [],
  tomorrowSlots: [],
  dayAfterTomorrowSlots: [],
  livePerformer: null,
  nextUpPerformer: null,
  isLoading: false,
  error: null,

  // --- ACTIONS ---
  fetchSchedule: async () => {
    set({
      isLoading: true,
      error: null,
      livePerformer: null,
      nextUpPerformer: null,
    });
    try {
      const allSlots: Slot[] = await getSchedule();

      const now = new Date();
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);
      const dayAfter = new Date();
      dayAfter.setDate(today.getDate() + 2);

      const todaySlots: Slot[] = [];
      const tomorrowSlots: Slot[] = [];
      const dayAfterTomorrowSlots: Slot[] = [];
      let currentLiveSlot: Slot | null = null;

      allSlots.forEach((slot: Slot) => {
        const slotDate = new Date(slot.startTime);
        if (slotDate.toDateString() === today.toDateString()) {
          todaySlots.push(slot);
          const startTime = new Date(slot.startTime).getTime();
          const endTime = startTime + 15 * 60 * 1000;
          if (
            slot.status === "booked" &&
            now.getTime() >= startTime &&
            now.getTime() < endTime
          ) {
            currentLiveSlot = slot;
          }
        } else if (slotDate.toDateString() === tomorrow.toDateString()) {
          tomorrowSlots.push(slot);
        } else if (slotDate.toDateString() === dayAfter.toDateString()) {
          dayAfterTomorrowSlots.push(slot);
        }
      });

      let nextUpSlot: Slot | null = null;
      if (!currentLiveSlot) {
        // Find the first booked slot in the future
        const allFutureSlots = [
          ...todaySlots,
          ...tomorrowSlots,
          ...dayAfterTomorrowSlots,
        ];
        nextUpSlot =
          allFutureSlots.find(
            (slot) => slot.status === "booked" && new Date(slot.startTime) > now
          ) || null;
      }

      set({
        todaySlots,
        tomorrowSlots,
        dayAfterTomorrowSlots,
        livePerformer: currentLiveSlot,
        nextUpPerformer: nextUpSlot, // Set the found upcoming performer
        isLoading: false,
      });
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch schedule.";
      set({ error: errorMessage, isLoading: false });
    }
  },

  updateLiveStatus: () => {
    const allSlots = get().allSlots;
    const processedData = processSlots(allSlots);
    set(processedData);
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
