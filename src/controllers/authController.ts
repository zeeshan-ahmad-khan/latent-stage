import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User, { UserRole } from "../models/User.js";
import keys from "../config/keys.js";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const {
      email,
      username,
      password,
      role,
      firstName,
      lastName,
      dob,
      middleName, // optional
      bio, // optional
      socialLinks, // optional
      profilePictureUrl, // optional
    } = req.body;

    // --- Comprehensive Validation ---
    if (
      !email ||
      !username ||
      !password ||
      !role ||
      !firstName ||
      !lastName ||
      !dob
    ) {
      return res.status(400).json({
        message:
          "Please provide all required fields: email, username, password, role, firstName, lastName, and dob.",
      });
    }
    if (!Object.values(UserRole).includes(role)) {
      return res.status(400).json({
        message: 'Invalid role specified. Must be "Performer" or "Audience".',
      });
    }

    // --- Check for Existing User ---
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({
        message: "A user with this email or username already exists.",
      });
    }

    // --- Hash Password ---
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // --- Create New User Document ---
    const newUser = new User({
      email,
      username,
      passwordHash,
      role,
      firstName,
      lastName,
      middleName,
      dob: new Date(dob), // Ensure DOB is stored as a Date object
      profilePictureUrl,
      bio: role === UserRole.Performer ? bio : undefined,
      socialLinks: role === UserRole.Performer ? socialLinks : undefined,
    });

    // --- Save to Database ---
    await newUser.save();

    res.status(201).json({
      message: "User registered successfully!",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error during registration." });
  }
};

// The loginUser function remains unchanged
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { loginIdentifier, password } = req.body; // Changed 'email' to 'loginIdentifier'

    if (!loginIdentifier || !password) {
      return res
        .status(400)
        .json({ message: "Please provide a username/email and password." });
    }

    // --- Find the user by either email OR username ---
    // The $or operator tells MongoDB to find a document that matches any of the conditions in the array.
    const user = await User.findOne({
      $or: [{ email: loginIdentifier }, { username: loginIdentifier }],
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // --- Compare Passwords (no change here) ---
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // --- Create and Send JWT (no change here) ---
    const payload = {
      id: user._id,
      username: user.username,
      role: user.role,
    };

    const token = jwt.sign(payload, keys.jwtSecret, { expiresIn: "1h" });

    res.status(200).json({
      message: "Login successful!",
      token: `Bearer ${token}`,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login." });
  }
};
