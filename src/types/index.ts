import type { Socket } from "socket.io";

export interface UserPayload {
  id: string;
  username: string;
  role: string;
}

// Extend the base Socket type to include our custom user property
export interface AugmentedSocket extends Socket {
  user: UserPayload;
}
