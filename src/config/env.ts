import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;
export const JWT_SECRET = process.env.JWT_SECRET;

// This check ensures that JWT_SECRET is a string, satisfying TypeScript's type requirements.
if (!JWT_SECRET) {
  throw new Error("FATAL ERROR: JWT_SECRET is not defined in .env file.");
}
