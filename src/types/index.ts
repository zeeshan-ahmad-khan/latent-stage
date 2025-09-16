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
}

export type UserRole = "Performer" | "Audience";
