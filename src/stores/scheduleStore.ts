import { create } from "zustand";
import {
  getSchedule,
  bookSlot,
  cancelBooking,
} from "../services/scheduleService";
import type { User } from "../types";

export interface Slot {
  _id: string;
  startTime: string;
  status: "available" | "booked";
  performer?: User;
}

interface ScheduleState {
  // allSlots is no longer needed
  todaySlots: Slot[];
  tomorrowSlots: Slot[];
  dayAfterTomorrowSlots: Slot[];
  livePerformer: Slot | null;
  nextUpPerformer: Slot | null;
  isLoading: boolean;
  error: string | null;
  fetchSchedule: () => Promise<void>;
  // updateLiveStatus is removed
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

  let currentLiveSlot: Slot | null = null;
  for (const slot of todaySlots) {
    if (slot.status === "booked") {
      const startTime = new Date(slot.startTime).getTime();
      const endTime = startTime + 15 * 60 * 1000;
      if (now.getTime() >= startTime && now.getTime() < endTime) {
        currentLiveSlot = slot;
        break;
      }
    }
  }

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
  todaySlots: [],
  tomorrowSlots: [],
  dayAfterTomorrowSlots: [],
  livePerformer: null,
  nextUpPerformer: null,
  isLoading: false,
  error: null,

  fetchSchedule: async () => {
    // Set loading to true only if there's no data yet, to prevent UI flicker during polls
    if (get().todaySlots.length === 0) {
      set({ isLoading: true });
    }
    set({ error: null });

    try {
      const fetchedSlots: Slot[] = await getSchedule();
      const processedData = processSlots(fetchedSlots);
      set({ ...processedData, isLoading: false });
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch schedule.";
      set({ error: errorMessage, isLoading: false });
    }
  },

  // ✅ FIX: updateLiveStatus function is now removed.

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
