import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;
export const JWT_SECRET = process.env.JWT_SECRET;
export const MONGO_URI = process.env.MONGO_URI;

if (!JWT_SECRET || !MONGO_URI) {
  throw new Error(
    "FATAL ERROR: JWT_SECRET and MONGO_URI are not defined in .env file."
  );
}
