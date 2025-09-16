import mongoose, { Schema, Document } from "mongoose";

export interface ISetting extends Document {
  key: string;
  value: any;
}

const SettingSchema: Schema = new Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  value: {
    type: Schema.Types.Mixed, // Allows storing any data type
    required: true,
  },
});

const Setting = mongoose.model<ISetting>("Setting", SettingSchema);
export default Setting;
