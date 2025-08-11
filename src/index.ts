import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import mongoose from "mongoose";
import keys from "./config/keys.js";

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);

// Health check route
app.get("/", (req: Request, res: Response) => {
  res.send("Authentication Server is running...");
});

const startServer = async () => {
  try {
    await mongoose.connect(keys.mongoUri);
    console.log("MongoDB Connected...");

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
