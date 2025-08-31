// This is the shape of the user object returned by the API after registration
export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
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
