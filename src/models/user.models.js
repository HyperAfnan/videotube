import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
   {
      "User" : { type: "String", required: true, unique: true }
   }
)

export const User = mongoose.model("User", UserSchema)
