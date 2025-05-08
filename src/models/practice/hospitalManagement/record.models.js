import {mongoose, Schema} from "mongoose";

const RecordSchema = new Schema();

export const Record = mongoose.model("record", RecordSchema);
