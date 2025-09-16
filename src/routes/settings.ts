import { Router } from "express";
import { getSettings } from "../controllers/settingsController.js";

const router = Router();

// @route   GET /api/settings
// @desc    Get all application settings
router.get("/", getSettings);

export default router;
