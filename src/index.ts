import { createServer } from "http";
import { Server, Socket } from "socket.io";
import mongoose from "mongoose";
import { PORT, MONGO_URI } from "./config/env";
import { authMiddleware } from "./middlewares/socketAuth";
import Message from "./models/Message"; // Import our new Message model
import type { AugmentedSocket } from "./types";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.use(authMiddleware);

io.on("connection", (socket: Socket) => {
  const augmentedSocket = socket as AugmentedSocket;
  console.log(
    `User '${augmentedSocket.user.username}' connected with id ${augmentedSocket.id}`
  );

  socket.on("join_room", async (roomName: string) => {
    socket.join(roomName);
    console.log(
      `User '${augmentedSocket.user.username}' joined room: '${roomName}'`
    );

    // Fetch the last 50 messages from the database for this room
    const history = await Message.find({ room: roomName })
      .sort({ createdAt: -1 })
      .limit(50)
      .exec();

    // Send the history to the user who just joined
    socket.emit("chat_history", history.reverse());
  });

  socket.on(
    "send_message",
    async (data: { roomName: string; message: string }) => {
      const payload = {
        room: data.roomName,
        sender: augmentedSocket.user.username,
        message: data.message,
      };

      // Save the new message to the database
      const message = new Message(payload);
      await message.save();

      // Broadcast the message to all clients in the room
      io.to(data.roomName).emit("receive_message", payload);
    }
  );

  socket.on("disconnect", () => {
    console.log(`User '${augmentedSocket.user.username}' disconnected.`);
  });
});

// Start the server and connect to the database
const start = async () => {
  try {
    await mongoose.connect(MONGO_URI as string);
    console.log("MongoDB Connected...");
    httpServer.listen(PORT, () => {
      console.log(
        `✅ Socket.IO Chat server is running on http://localhost:${PORT}`
      );
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
