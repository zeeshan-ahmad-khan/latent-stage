import { Response } from "express";
import { AccessToken } from "livekit-server-sdk";
import { ProtectedRequest } from "../middlewares/authMiddleware.js";
import keys from "../config/keys.js";
import Slot from "../models/Slot.js";

/**
 * @desc    Generate a LiveKit access token for a user
 * @route   POST /api/livekit/token
 * @access  Private
 */
export const getLiveKitToken = async (req: ProtectedRequest, res: Response) => {
  const { roomName } = req.body; // roomName is the unique slotId
  const user = req.user;

  if (!roomName) {
    return res.status(400).json({ message: "Room name is required." });
  }

  if (!user) {
    return res.status(401).json({ message: "User not authenticated." });
  }

  // --- START: PERMISSION LOGIC ---

  // Find the slot corresponding to the roomName
  const slot = await Slot.findById(roomName);
  if (!slot) {
    return res.status(404).json({ message: "Performance slot not found." });
  }

  // Check if the user requesting the token is the one assigned to the slot
  const isPerformerForThisSlot =
    user.role === "Performer" &&
    slot.performer?.toString() === user._id.toString();

  // --- END: PERMISSION LOGIC ---

  const at = new AccessToken(keys.livekitApiKey, keys.livekitApiSecret, {
    identity: user.username,
    name: user.username,
  });

  at.addGrant({
    room: roomName,
    roomJoin: true,
    // ✅ FIX: Only grant publish rights if the user is the correct performer for this slot
    canPublish: isPerformerForThisSlot,
    canSubscribe: true,
    canPublishData: true,
  });

  const token = await at.toJwt();

  res.json({ token });
};
