import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./User.js"; // We need the User interface for population

// Defines the possible statuses for a slot
export enum SlotStatus {
  Available = "available",
  Booked = "booked",
}

// Interface to define the properties of a Slot document
export interface ISlot extends Document {
  startTime: Date;
  status: SlotStatus;
  performer?: IUser["_id"]; // Optional reference to the User who booked the slot
}

const SlotSchema: Schema = new Schema(
  {
    startTime: {
      type: Date,
      required: true,
      unique: true, // No two slots can have the same start time
      index: true, // Index for faster queries
    },
    status: {
      type: String,
      enum: Object.values(SlotStatus),
      default: SlotStatus.Available,
      required: true,
    },
    performer: {
      type: Schema.Types.ObjectId,
      ref: "User", // This creates a link to the User collection
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Slot = mongoose.model<ISlot>("Slot", SlotSchema);
export default Slot;
