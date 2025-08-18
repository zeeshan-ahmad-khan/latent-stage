import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import keys from "../config/keys.js";
import User from "../models/User.js";

// Extend the Express Request type to include our user payload
export interface ProtectedRequest extends Request {
  user?: any;
}

export const protect = async (
  req: ProtectedRequest,
  res: Response,
  next: NextFunction
) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    try {
      // Get token from header (e.g., "Bearer eyJhbGci...")
      token = authHeader.split(" ")[1];

      // Verify token
      const decoded: any = jwt.verify(token, keys.jwtSecret);

      // Get user from the DB and attach it to the request object
      // We select '-passwordHash' to exclude the password hash from the user object
      req.user = await User.findById(decoded.id).select("-passwordHash");

      if (!req.user) {
        return res
          .status(401)
          .json({ message: "Not authorized, user not found" });
      }

      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      console.error("Token verification failed:", error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};
