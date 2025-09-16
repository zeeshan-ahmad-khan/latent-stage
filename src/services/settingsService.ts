import Setting from "../models/Setting.js";

// In-memory cache for settings
let settingsCache: Map<string, any> = new Map();

/**
 * Loads all settings from the database into the in-memory cache.
 */
export const loadSettings = async () => {
  try {
    const settings = await Setting.find({});
    settingsCache = new Map(settings.map((s) => [s.key, s.value]));
    console.log("Application settings loaded into cache.");
  } catch (error) {
    console.error("Failed to load settings into cache:", error);
  }
};

/**
 * Retrieves a single setting value from the cache.
 * @param key The key of the setting to retrieve.
 * @param defaultValue A default value to return if the key is not found.
 */
export const getSetting = <T>(key: string, defaultValue: T): T => {
  return settingsCache.get(key) ?? defaultValue;
};

/**
 * Retrieves all settings as a plain object.
 */
export const getAllSettings = (): Record<string, any> => {
  return Object.fromEntries(settingsCache);
};
