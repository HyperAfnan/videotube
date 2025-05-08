import {Schema, mongoose} from "mongoose";

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {Timestamp: true}
);

export const Catagory = mongoose.model("Category", CategorySchema);
