import { Router } from "express";
import { registerUser, loginUser } from "../controllers/authController.js";

const router = Router();

// @route   POST /api/auth/register
// @desc    Register a new user
router.post("/register", registerUser);

// @route   POST /api/auth/login
// @desc    Authenticate user and get token
router.post("/login", loginUser);

export default router;
