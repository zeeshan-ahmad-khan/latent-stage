import mongoose, { Schema, Document } from "mongoose";

// Defines the possible roles a user can have.
export enum UserRole {
  Performer = "Performer",
  Audience = "Audience",
}

// Interface for the optional social links
export interface ISocialLinks {
  youtube?: string;
  instagram?: string;
  facebook?: string;
}

// Interface to define the properties of a User document
export interface IUser extends Document {
  email: string;
  username: string;
  passwordHash: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  middleName?: string;
  dob: Date;
  profilePictureUrl?: string;
  bio?: string;
  socialLinks?: ISocialLinks;
}

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(UserRole),
      required: true,
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    middleName: { type: String },
    dob: { type: Date, required: true },
    profilePictureUrl: { type: String, default: "" },
    bio: { type: String, default: "" },
    socialLinks: {
      youtube: { type: String, default: "" },
      instagram: { type: String, default: "" },
      facebook: { type: String, default: "" },
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
