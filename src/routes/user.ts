import { Router } from "express";
import {
  getUserProfile,
  updateUserProfile,
  getUserBookings, // Import the new controller function
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

// We can chain routes for the same path
router
  .route("/profile")
  .get(protect, getUserProfile) // GET /api/users/profile
  .put(protect, updateUserProfile); // PUT /api/users/profile

// Add the new route for fetching user bookings
router.route("/bookings").get(protect, getUserBookings); // GET /api/users/bookings

export default router;
