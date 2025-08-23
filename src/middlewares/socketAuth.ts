// latent-stage-chat/src/middleware/socketAuth.ts
import jwt from "jsonwebtoken";
import { Socket } from "socket.io";
import { JWT_SECRET } from "../config/env";
import type { UserPayload } from "../types";

// This is a "type guard" to check if an object is a valid UserPayload
function isUserPayload(payload: any): payload is UserPayload {
  return (
    typeof payload === "object" &&
    payload !== null &&
    "id" in payload &&
    "username" in payload &&
    "role" in payload
  );
}

// Socket.IO middleware for authenticating users
export const authMiddleware = (socket: Socket, next: (err?: Error) => void) => {
  // Socket.IO clients send credentials in the `auth` object during connection
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error("Authentication error: Token not provided."));
  }

  try {
    const decodedPayload = jwt.verify(token, JWT_SECRET as string);

    if (isUserPayload(decodedPayload)) {
      // Attach the user to the socket object for use in other event handlers
      (socket as any).user = decodedPayload;
      next(); // Authentication successful, proceed with the connection
    } else {
      next(new Error("Authentication error: Invalid token payload."));
    }
  } catch (err) {
    next(new Error("Authentication error: Invalid token."));
  }
};
