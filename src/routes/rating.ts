import { Router } from "express";
import { submitRating } from "../controllers/ratingController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

router.route("/:slotId").post(protect, submitRating);

export default router;
