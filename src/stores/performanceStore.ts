import { create } from "zustand";
import { addMinutes, differenceInSeconds } from "date-fns";

export type PerformanceState = "live" | "ended" | "grace";

interface PerformanceStore {
  performanceState: PerformanceState;
  timeLeft: number;
  timerId: number | null;
  startPerformanceTimer: (startTime: string, durationMinutes: number) => void;
  stopPerformanceTimer: () => void;
}

export const usePerformanceStore = create<PerformanceStore>((set, get) => ({
  performanceState: "live",
  timeLeft: 0,
  timerId: null,

  startPerformanceTimer: (startTime, durationMinutes) => {
    get().stopPerformanceTimer();

    const performanceStartTime = new Date(startTime);
    const performanceEndTime = addMinutes(
      performanceStartTime,
      durationMinutes
    );
    const graceEndTime = addMinutes(performanceEndTime, 5);

    const timer = setInterval(() => {
      const now = new Date();
      const newTimeLeft = Math.max(
        0,
        differenceInSeconds(performanceEndTime, now)
      );
      set({ timeLeft: newTimeLeft });

      if (now >= graceEndTime) {
        set({ performanceState: "grace" });
        get().stopPerformanceTimer();
      } else if (now >= performanceEndTime) {
        set({ performanceState: "ended" });
      } else {
        set({ performanceState: "live" });
      }
    }, 1000) as unknown as number;

    set({ timerId: timer });
  },

  stopPerformanceTimer: () => {
    const { timerId } = get();
    if (timerId) {
      clearInterval(timerId);
      set({ timerId: null });
    }
  },
}));
