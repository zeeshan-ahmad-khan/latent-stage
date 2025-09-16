import { Request, Response } from "express";
import { getAllSettings } from "../services/settingsService.js";

/**
 * @desc    Get all application settings
 * @route   GET /api/settings
 * @access  Public
 */
export const getSettings = (req: Request, res: Response) => {
  try {
    const settings = getAllSettings();
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching settings." });
  }
};
