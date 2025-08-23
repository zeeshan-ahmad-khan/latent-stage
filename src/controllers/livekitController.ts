import { Response } from "express";
import { AccessToken } from "livekit-server-sdk";
import { ProtectedRequest } from "../middlewares/authMiddleware.js";
import keys from "../config/keys.js";

/**
 * @desc    Generate a LiveKit access token for a user
 * @route   POST /api/livekit/token
 * @access  Private
 */
export const getLiveKitToken = async (req: ProtectedRequest, res: Response) => {
  const { roomName } = req.body;
  const user = req.user;

  if (!roomName) {
    return res.status(400).json({ message: "Room name is required." });
  }

  if (!user) {
    return res.status(401).json({ message: "User not authenticated." });
  }

  // Create a new AccessToken
  const at = new AccessToken(keys.livekitApiKey, keys.livekitApiSecret, {
    identity: user.username, // Use the user's username as their identity in the room
    name: user.username,
  });

  // Define the permissions for this user
  at.addGrant({
    room: roomName,
    roomJoin: true,
    canPublish: user.role === "Performer", // Only performers can publish audio
    canSubscribe: true, // Everyone can subscribe (listen)
  });

  // Generate the JWT for LiveKit
  const token = await at.toJwt();

  res.json({ token });
};
