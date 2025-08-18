import { Response } from "express";
import User from "../models/User.js";
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
    user.username = req.body.username || user.username;
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.bio = req.body.bio || user.bio;
    user.profilePictureUrl =
      req.body.profilePictureUrl || user.profilePictureUrl;

    if (req.body.socialLinks) {
      user.socialLinks = { ...user.socialLinks, ...req.body.socialLinks };
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      bio: updatedUser.bio,
      profilePictureUrl: updatedUser.profilePictureUrl,
      socialLinks: updatedUser.socialLinks,
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};
