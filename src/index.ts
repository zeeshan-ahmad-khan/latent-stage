import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import settingsRoutes from "./routes/settings.js";
import livekitRoutes from "./routes/livekit.js";
import scheduleRoutes from "./routes/schedule.js";
import mongoose from "mongoose";
import keys from "./config/keys.js";
import Setting from "./models/Setting.js";
import { loadSettings } from "./services/settingsService.js";

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/livekit", livekitRoutes);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/settings", settingsRoutes);

// Health check route
app.get("/", (req: Request, res: Response) => {
  res.send("Latent Stage Server is running...");
});

const seedSettings = async () => {
  const settings = [
    { key: "SLOT_DURATION_MINUTES", value: 20 },
    { key: "CANCELLATION_WINDOW_HOURS", value: 1.25 },
    { key: "LAST_MINUTE_WINDOW_HOURS", value: 1.25 },
  ];

  for (const setting of settings) {
    await Setting.findOneAndUpdate(
      { key: setting.key },
      { $setOnInsert: { value: setting.value } },
      { upsert: true, new: true }
    );
  }
  console.log("Settings seeded successfully.");
};

const startServer = async () => {
  try {
    await mongoose.connect(keys.mongoUri);
    console.log("MongoDB Connected...");

    await seedSettings(); // Seed the settings into the DB
    await loadSettings(); // Load settings into the cache

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    const error = err as Error;
    console.error(error.message);
    // Exit process with failure
    process.exit(1);
  }
};

startServer();
