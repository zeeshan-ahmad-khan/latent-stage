import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const MONGO_URI = process.env.MONGO_URI;
const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY;
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET;
const LIVEKIT_HOST = process.env.LIVEKIT_URL;

if (!JWT_SECRET || !MONGO_URI) {
  console.error(
    "Fatal Error: Make sure JWT_SECRET and MONGO_URI are defined in your .env file."
  );
  process.exit(1);
}

export default {
  jwtSecret: JWT_SECRET,
  mongoUri: MONGO_URI,
  livekitApiKey: LIVEKIT_API_KEY,
  livekitApiSecret: LIVEKIT_API_SECRET,
  livekitHost: LIVEKIT_HOST,
};
