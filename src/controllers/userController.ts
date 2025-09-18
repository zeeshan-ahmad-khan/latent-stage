import { Response } from "express";
import User from "../models/User.js";
import Slot from "../models/Slot.js";
import { ProtectedRequest } from "../middlewares/authMiddleware.js";

/**
 * @desc    Get current user's profile
 * @route   GET /api/users/profile
 * @access  Private
 */
export const getUserProfile = async (req: ProtectedRequest, res: Response) => {
  // The user object is already attached to the request by the `protect` middleware
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
export const updateUserProfile = async (
  req: ProtectedRequest,
  res: Response
) => {
  const user = await User.findById(req.user._id);

  if (user) {
    // General fields that both user types can update
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.profilePictureUrl =
      req.body.profilePictureUrl || user.profilePictureUrl;

    // Performer-specific fields
    if (user.role === "Performer") {
      user.bio = req.body.bio ?? user.bio;
      if (req.body.socialLinks) {
        // FIX: Ensure user.socialLinks is an object before assigning to it
        if (!user.socialLinks) {
          user.socialLinks = {};
        }
        user.socialLinks.youtube =
          req.body.socialLinks.youtube ?? user.socialLinks.youtube;
        user.socialLinks.instagram =
          req.body.socialLinks.instagram ?? user.socialLinks.instagram;
        user.socialLinks.facebook =
          req.body.socialLinks.facebook ?? user.socialLinks.facebook;
      }
    }

    const updatedUser = await user.save();

    // Return a lean object, excluding the password hash
    const userObject = updatedUser.toObject();
    const { passwordHash, ...userWithoutPassword } = userObject;

    res.json(userWithoutPassword);

    res.json(userObject);
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

/**
 * @desc    Get all bookings for the current user with pagination for past bookings
 * @route   GET /api/users/bookings?page=1
 * @access  Private
 */
export const getUserBookings = async (req: ProtectedRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 10; // Number of past bookings per page
    const skip = (page - 1) * limit;
    const now = new Date();

    // 1. Fetch all upcoming bookings (usually not a large number)
    const upcomingBookings = await Slot.find({
      performer: req.user._id,
      startTime: { $gte: now },
    })
      .sort({ startTime: "desc" })
      .exec();

    // 2. Fetch a paginated list of past bookings
    const pastBookings = await Slot.find({
      performer: req.user._id,
      startTime: { $lt: now },
    })
      .sort({ startTime: "desc" })
      .limit(limit)
      .skip(skip)
      .exec();

    // 3. Get the total count of past bookings for the frontend
    const totalPastBookings = await Slot.countDocuments({
      performer: req.user._id,
      startTime: { $lt: now },
    });

    res.status(200).json({
      upcomingBookings,
      pastBookings: {
        bookings: pastBookings,
        totalPages: Math.ceil(totalPastBookings / limit),
        currentPage: page,
      },
    });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ message: "Server error while fetching bookings." });
  }
};
