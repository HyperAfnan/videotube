import { Schema, mongoose } from "mongoose";

const tweetSchema = new Schema(
	{
		content: { type: String, required: true },
		owner: { type: Schema.Types.ObjectId, ref: "user" },
	},
	{ timestamps: true }
);

export const Tweet = mongoose.model("tweet", tweetSchema);
