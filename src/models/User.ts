// Define the structure of a User object
export type User = {
  id: number;
  username: string;
  email: string;
  passwordHash: string; // We'll store the hashed password
};

// In-memory "database" for demonstration
export const users: User[] = [];

// A simple counter for generating unique user IDs
export let userIdCounter = 1;

// Function to add a user (we might expand this later)
export const addUser = (user: User) => {
  users.push(user);
  userIdCounter++;
};
