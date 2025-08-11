import { Request, Response } from "express";

export const registerUser = async (req: Request, res: Response) => {
  // Logic to register a user will go here
  res.status(201).json({ message: "Register endpoint hit" });
};

export const loginUser = async (req: Request, res: Response) => {
  // Logic to log in a user will go here
  res.status(200).json({ message: "Login endpoint hit" });
};
