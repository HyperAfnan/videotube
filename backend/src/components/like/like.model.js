import { mongoose, Schema } from "mongoose";
const likesSchema = new Schema(
   {
      video: { type: Schema.Types.ObjectId, ref: "video" },
      comment: { type: Schema.Types.ObjectId, ref: "comment" },
      tweet: { type: Schema.Types.ObjectId, ref: "tweet" },
      likedBy: { type: Schema.Types.ObjectId, ref: "user", required: true },
      type: { type: String, enum: ["like", "dislike"], required: true },
   },
   { timestamps: true },
);

export const Like = mongoose.model("like", likesSchema);
