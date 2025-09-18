// This is the shape of the full user object returned by the API
export interface User {
  _id: string; // Use _id to match MongoDB
  id: string;
  username: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  profilePictureUrl?: string;
  bio?: string;
  socialLinks?: {
    youtube?: string;
    instagram?: string;
    facebook?: string;
  };
}

// ✅ FIX: Use a string literal type for compile-time safety.
export type UserRole = "Performer" | "Audience";

// ✅ FIX: Create a constant object for runtime value checks.
export const UserRoles = {
  Performer: "Performer" as UserRole,
  Audience: "Audience" as UserRole,
};

// This is the data required for the login API endpoint
export interface LoginCredentials {
  loginIdentifier: string;
  password: string;
}

// This is the data required for the registration API endpoint
export interface RegisterData {
  username: string;
  email: string;
  password: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  dob: string; // Will be a string like "YYYY-MM-DD" from the form
}
