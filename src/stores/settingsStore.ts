import { create } from "zustand";
import { getSettings } from "../services/settingsService";

interface AppSettings {
  SLOT_DURATION_MINUTES: number;
  CANCELLATION_WINDOW_HOURS: number;
  LAST_MINUTE_WINDOW_HOURS: number;
  [key: string]: any; // To allow for future settings
}

interface SettingsState {
  settings: AppSettings | null;
  isLoading: boolean;
  fetchSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: null,
  isLoading: true,
  fetchSettings: async () => {
    try {
      set({ isLoading: true });
      const settingsData = await getSettings();
      set({ settings: settingsData, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch app settings:", error);
      set({ isLoading: false });
    }
  },
}));
