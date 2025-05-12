import { Schema, mongoose } from "mongoose";
const likesSchema = new Schema(
	{
		video: { type: Schema.Types.ObjectId, ref: "user" },
		comment: { type: Schema.Types.ObjectId, ref: "comment" },
		tweet: { type: Schema.Types.ObjectId, ref: "tweet" },
	},
	{ timestamps: true }
);

export const Like = mongoose.model("like", likesSchema);
