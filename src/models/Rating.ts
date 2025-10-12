import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./User.js";
import { ISlot } from "./Slot.js";

export interface IRating extends Document {
  slot: ISlot["_id"];
  user: IUser["_id"];
  score: number;
}

const RatingSchema: Schema = new Schema(
  {
    slot: { type: Schema.Types.ObjectId, ref: "Slot", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    score: { type: Number, required: true, min: 1, max: 5 },
  },
  {
    timestamps: true,
  }
);

// Prevent a user from rating the same slot twice
RatingSchema.index({ slot: 1, user: 1 }, { unique: true });

const Rating = mongoose.model<IRating>("Rating", RatingSchema);
export default Rating;
