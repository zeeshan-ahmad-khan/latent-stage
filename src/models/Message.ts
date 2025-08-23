import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  room: string;
  sender: string;
  message: string;
}

const MessageSchema: Schema = new Schema(
  {
    room: { type: String, required: true, index: true },
    sender: { type: String, required: true },
    message: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model<IMessage>("Message", MessageSchema);
export default Message;
