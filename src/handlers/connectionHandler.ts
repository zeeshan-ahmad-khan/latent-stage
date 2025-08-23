import { WebSocket } from "ws";
import { IncomingMessage } from "http";
import url from "url";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env";
import { UserPayload, AugmentedWebSocket } from "../types";
import { joinRoom, leaveRoom, broadcastMessage } from "../lib/roomManager";

// This is a "type guard" function. It safely checks if the decoded object
// has the exact properties we expect in our UserPayload.
function isUserPayload(payload: any): payload is UserPayload {
  return (
    typeof payload === "object" &&
    payload !== null &&
    "id" in payload &&
    "username" in payload &&
    "role" in payload
  );
}

export const handleConnection = (ws: WebSocket, req: IncomingMessage) => {
  const parameters = new URLSearchParams(url.parse(req.url || "").search || "");
  const token = parameters.get("token");
  const roomName = parameters.get("room");

  if (!token || !roomName) {
    ws.close(1008, "Token and room name are required.");
    return;
  }

  try {
    const decodedPayload = jwt.verify(token, JWT_SECRET as string);

    // We use our type guard here. If this check passes, TypeScript
    // now knows for sure that decodedPayload is a valid UserPayload.
    if (isUserPayload(decodedPayload)) {
      const augmentedWs = ws as AugmentedWebSocket;
      augmentedWs.user = decodedPayload; // This assignment is now safe.

      console.log(
        `User '${augmentedWs.user.username}' authenticated and connected.`
      );
      joinRoom(augmentedWs, roomName);

      augmentedWs.on("message", (rawMessage: Buffer) => {
        const message = rawMessage.toString();
        console.log(
          `Received message in room '${roomName}' from '${augmentedWs.user.username}': ${message}`
        );
        broadcastMessage(augmentedWs, roomName, message);
      });

      augmentedWs.on("close", () => {
        console.log(`User '${augmentedWs.user.username}' disconnected.`);
        leaveRoom(augmentedWs, roomName);
      });

      augmentedWs.on("error", (error) => {
        console.error(
          `WebSocket error for user '${augmentedWs.user.username}':`,
          error
        );
      });
    } else {
      // If the token is valid but doesn't have the right shape, reject it.
      throw new Error("Invalid token payload structure");
    }
  } catch (err) {
    console.log("Connection rejected: Invalid token.");
    ws.close(1008, "Invalid token.");
  }
};
