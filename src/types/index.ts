export interface Performer {
  _id: string;
  username: string;
  profilePictureUrl?: string;
  bio?: string;
  socialLinks?: {
    youtube?: string;
    instagram?: string;
    facebook?: string;
  };
  // ✅ ADD THESE TWO LINES
  averageRating?: number;
  ratingCount?: number;
}

export type UserRole = "Performer" | "Audience";

export type PerformanceState = "live" | "ended" | "grace";
