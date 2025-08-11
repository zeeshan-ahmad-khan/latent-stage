import mongoose, { Schema, Document } from "mongoose";

// Interface to define the properties of a User document
export interface IUser extends Document {
  username: string;
  email: string;
  passwordHash: string;
}

// Mongoose Schema to define the structure and rules for the User model
const UserSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensures no two users can have the same email
    },
    passwordHash: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create and export the Mongoose model
const User = mongoose.model<IUser>("User", UserSchema);
export default User;
