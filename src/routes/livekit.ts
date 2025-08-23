import { Router } from "express";
import { getLiveKitToken } from "../controllers/livekitController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

// This route is protected, so only logged-in users can get a token
router.post("/token", protect, getLiveKitToken);

export default router;
