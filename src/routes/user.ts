import { Router } from "express";
import {
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

// We can chain routes for the same path
router
  .route("/profile")
  .get(protect, getUserProfile) // GET /api/users/profile
  .put(protect, updateUserProfile); // PUT /api/users/profile

export default router;
