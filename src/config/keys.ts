import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error("No JWT_SECRET found in .env file. Exiting.");
  process.exit(1);
}

export default {
  jwtSecret: JWT_SECRET,
};
