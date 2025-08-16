// This is the shape of the user object returned by the API after registration
export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
}

// --- FIX IS HERE ---
// Instead of an enum, we use a simple union of string types.
// This provides the same type safety without causing the build error.
export type UserRole = "Performer" | "Audience";

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
