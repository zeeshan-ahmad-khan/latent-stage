import { Router, Response, NextFunction } from "express";
import { protect, ProtectedRequest } from "../middlewares/authMiddleware.js";
import { UserRole } from "../models/User.js";

// We will create these controller functions in the next step
import {
  getSchedule,
  bookSlot,
  cancelSlot,
} from "../controllers/scheduleController.js";

// Middleware to check if the authenticated user is a Performer
const isPerformer = (
  req: ProtectedRequest,
  res: Response,
  next: NextFunction
) => {
  // The 'protect' middleware should have already attached the user object
  if (req.user && req.user.role === UserRole.Performer) {
    next(); // User is a performer, proceed to the next handler
  } else {
    // If not a performer, send a "Forbidden" error
    res
      .status(403)
      .json({ message: "Forbidden: Not authorized as a Performer" });
  }
};

const router = Router();

// @route   GET /api/schedule
// @desc    Get all available and booked slots for the next 3 days
// @access  Public
router.get("/", getSchedule);

// @route   POST /api/schedule/book/:slotId
// @desc    Book an available slot
// @access  Private (Performers Only)
router.post("/book/:slotId", protect, isPerformer, bookSlot);

// @route   DELETE /api/schedule/cancel/:slotId
// @desc    Cancel a performer's booked slot
// @access  Private (Performers Only)
router.delete("/cancel/:slotId", protect, isPerformer, cancelSlot);

export default router;
