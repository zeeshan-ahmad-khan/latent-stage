// latent-stage-chat/src/index.ts
import { createServer } from "http";
import { Server, Socket } from "socket.io"; // Import the base Socket type
import { PORT } from "./config/env";
import { authMiddleware } from "./middlewares/socketAuth";
import type { AugmentedSocket } from "./types";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.use(authMiddleware);

// --- FIX IS HERE ---
// The handler initially receives a generic 'Socket'
io.on("connection", (socket: Socket) => {
  // We then cast it to our augmented type to access the 'user' property.
  // This is safe because our middleware guarantees 'user' exists if the connection is allowed.
  const augmentedSocket = socket as AugmentedSocket;

  console.log(
    `User '${augmentedSocket.user.username}' connected with id ${augmentedSocket.id}`
  );

  socket.on("join_room", (roomName: string) => {
    socket.join(roomName);
    console.log(
      `User '${augmentedSocket.user.username}' joined room: '${roomName}'`
    );
  });

  socket.on("send_message", (data: { roomName: string; message: string }) => {
    const payload = {
      sender: augmentedSocket.user.username,
      message: data.message,
      timestamp: new Date().toISOString(),
    };
    io.to(data.roomName).emit("receive_message", payload);
  });

  socket.on("disconnect", () => {
    console.log(`User '${augmentedSocket.user.username}' disconnected.`);
  });
});

httpServer.listen(PORT, () => {
  console.log(
    `✅ Socket.IO Chat server is running on http://localhost:${PORT}`
  );
});
