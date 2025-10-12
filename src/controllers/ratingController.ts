import { Response } from "express";
import { ProtectedRequest } from "../middlewares/authMiddleware.js";
import Rating from "../models/Rating.js";
import Slot from "../models/Slot.js";
import User, { IUser } from "../models/User.js";

export const submitRating = async (req: ProtectedRequest, res: Response) => {
  const { slotId } = req.params;
  const { score } = req.body;
  const userId = req.user._id;

  if (!score || score < 1 || score > 5) {
    return res
      .status(400)
      .json({ message: "A score between 1 and 5 is required." });
  }

  try {
    const slot = await Slot.findById(slotId).populate("performer");
    if (!slot || !slot.performer) {
      return res
        .status(404)
        .json({ message: "Performance slot or performer not found." });
    }

    await Rating.findOneAndUpdate(
      { slot: slotId, user: userId },
      { score: score },
      { new: true, upsert: true, runValidators: true }
    );

    const performerId = (slot.performer as IUser)._id;

    // Recalculate average rating for the performer
    const allRatingsForPerformer = await Rating.find({
      // Find ratings for any slot by this performer
      slot: {
        $in: await Slot.find({ performer: performerId }).distinct("_id"),
      },
    });

    const totalRating = allRatingsForPerformer.reduce(
      (acc, r) => acc + r.score,
      0
    );
    const ratingCount = allRatingsForPerformer.length;

    await User.findByIdAndUpdate(performerId, {
      totalRating: totalRating,
      ratingCount: ratingCount,
      averageRating: ratingCount > 0 ? totalRating / ratingCount : 0,
    });

    res.status(201).json({ message: "Rating submitted successfully" });
  } catch (error) {
    console.error("Error submitting rating:", error);
    res.status(500).json({ message: "Server error while submitting rating." });
  }
};
